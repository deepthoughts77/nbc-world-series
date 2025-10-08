# scripts/pdf_extract_and_import.py
import os
import re
import json
import pandas as pd
import requests
import tabula

# ====== CONFIG: edit these as needed ======
PDF_PATH   = r"C:\Users\erico\Documents\classes\lib_project\Final 2025 team stax (1).pdf"
API_BASE   = "http://localhost:5000/api"
SEASON_KEY = "NBC-2025"
# ==========================================

# heuristics to identify tables by header keywords
TEAMS_HINTS    = {"name", "pool", "record", "home", "away", "home record", "away record"}
BATTING_HINTS  = {"gp","gs","ab","r","h","2b","3b","hr","rbi","tb","slg","bb","hbp","so","gdp","obp","sf","sh","sb","att"}
PITCHING_HINTS = {"era","w","l","app","gs","cg","sho","cbo","sv","ip","h","r","er","bb","so","2b","3b","hr","wp","hbp","bk","sfa","sha"}

def lower_clean_cols(df: pd.DataFrame) -> pd.DataFrame:
    def clean(c):
        c = str(c).strip().lower()
        c = c.replace("\n"," ").replace("\r"," ")
        c = re.sub(r"\s+", " ", c)
        # normalize some typical variants
        mapping = {
            "player name": "name",
            "player": "name",
            "team": "team_name",
            "team name": "team_name",
            "#": "jersey_no",
            "no": "jersey_no",
            "number": "jersey_no",
            "home record": "home_record",
            "away record": "away_record",
        }
        return mapping.get(c, c)
    df.columns = [clean(c) for c in df.columns]
    return df

def classify_table(df: pd.DataFrame) -> str:
    cols = set(df.columns)
    # measure overlap with hint sets
    def score(hints): return len(cols & hints)
    scores = {
        "teams": score(TEAMS_HINTS),
        "batting": score(BATTING_HINTS),
        "pitching": score(PITCHING_HINTS),
    }
    return max(scores, key=scores.get)

def read_all_tables(pdf_path: str):
    # try lattice, then stream
    all_tables = []
    for mode in ("lattice", "stream"):
        try:
            tables = tabula.read_pdf(pdf_path, pages="all", multiple_tables=True, lattice=(mode=="lattice"), stream=(mode=="stream"))
            for t in tables:
                if not isinstance(t, pd.DataFrame) or t.empty:
                    continue
                t = t.dropna(how="all")
                if t.empty:
                    continue
                t = lower_clean_cols(t)
                all_tables.append(t)
        except Exception as e:
            print(f"[warn] {mode} mode failed: {e}")
    return all_tables

def pick_best_by_class(tables):
    buckets = {"teams": [], "batting": [], "pitching": []}
    for df in tables:
        cls = classify_table(df)
        buckets[cls].append(df)

    # choose the widest reasonable table for each class
    pick = {}
    for cls, dfs in buckets.items():
        if not dfs:
            pick[cls] = None
            continue
        # preference: more columns and more rows
        dfs = sorted(dfs, key=lambda d: (d.shape[1], d.shape[0]), reverse=True)
        pick[cls] = dfs[0]
    return pick

def safe_int(x):
    try:
        s = str(x).strip()
        if s == "" or s.lower() == "nan":
            return None
        return int(float(s))
    except:
        return None

def safe_float(x):
    try:
        s = str(x).strip()
        if s == "" or s.lower() == "nan":
            return None
        return float(s)
    except:
        return None

def df_to_teams(df: pd.DataFrame):
    # expected: name, pool, record, home_record, away_record (names flexible)
    cols = set(df.columns)
    get = lambda r, *opts: next((str(r.get(o, "")).strip() for o in opts if o in cols), "")
    out = []
    for _, r in df.iterrows():
        name = get(r, "name")
        if not name:
            continue
        team = {
            "name": name,
            "pool": get(r, "pool") or None,
            "record": get(r, "record") or None,
            "home": get(r, "home_record", "home") or None,
            "away": get(r, "away_record", "away") or None,
        }
        out.append(team)
    return out

def df_to_batting(df: pd.DataFrame):
    df = df.copy()
    cols = set(df.columns)
    # guess team/player columns
    team_col = "team_name" if "team_name" in cols else ("team" if "team" in cols else None)
    name_col = "name" if "name" in cols else ("player" if "player" in cols else None)
    jersey_col = "jersey_no" if "jersey_no" in cols else None
    out = []
    for _, r in df.iterrows():
        name = str(r.get(name_col, "")).strip() if name_col else ""
        if not name:
            continue
        out.append({
            "team_name":  str(r.get(team_col, "")).strip() if team_col else "",
            "jersey_no":  safe_int(r.get(jersey_col)) if jersey_col else None,
            "name":       name,
            "season_key": SEASON_KEY,
            "gp":  safe_int(r.get("gp")),
            "gs":  safe_int(r.get("gs")),
            "ab":  safe_int(r.get("ab")),
            "r":   safe_int(r.get("r")),
            "h":   safe_int(r.get("h")),
            "2b":  safe_int(r.get("2b")),
            "3b":  safe_int(r.get("3b")),
            "hr":  safe_int(r.get("hr")),
            "rbi": safe_int(r.get("rbi")),
            "tb":  safe_int(r.get("tb")),
            "slg": safe_float(r.get("slg")),
            "bb":  safe_int(r.get("bb")),
            "hbp": safe_int(r.get("hbp")),
            "so":  safe_int(r.get("so")),
            "gdp": safe_int(r.get("gdp")),
            "obp": safe_float(r.get("obp")),
            "sf":  safe_int(r.get("sf")),
            "sh":  safe_int(r.get("sh")),
            "sb":  safe_int(r.get("sb")),
            "att": safe_int(r.get("att")) if "att" in cols else safe_int(r.get("sb_att") if "sb_att" in cols else None),
        })
    return out

def df_to_pitching(df: pd.DataFrame):
    df = df.copy()
    cols = set(df.columns)
    team_col = "team_name" if "team_name" in cols else ("team" if "team" in cols else None)
    name_col = "name" if "name" in cols else ("player" if "player" in cols else None)
    jersey_col = "jersey_no" if "jersey_no" in cols else None
    out = []
    for _, r in df.iterrows():
        name = str(r.get(name_col, "")).strip() if name_col else ""
        if not name:
            continue
        out.append({
            "team_name":  str(r.get(team_col, "")).strip() if team_col else "",
            "jersey_no":  safe_int(r.get(jersey_col)) if jersey_col else None,
            "name":       name,
            "season_key": SEASON_KEY,
            "era": safe_float(r.get("era")),
            "w":   safe_int(r.get("w")),
            "l":   safe_int(r.get("l")),
            "app": safe_int(r.get("app")),
            "gs":  safe_int(r.get("gs")),
            "cg":  safe_int(r.get("cg")),
            "sho": safe_int(r.get("sho")),
            "cbo": safe_int(r.get("cbo")),
            "sv":  safe_int(r.get("sv")),
            "ip":  safe_float(r.get("ip")),
            "h":   safe_int(r.get("h")),
            "r":   safe_int(r.get("r")),
            "er":  safe_int(r.get("er")),
            "bb":  safe_int(r.get("bb")),
            "so":  safe_int(r.get("so")),
            "2b":  safe_int(r.get("2b")),
            "3b":  safe_int(r.get("3b")),
            "hr":  safe_int(r.get("hr")),
            "wp":  safe_int(r.get("wp")),
            "hbp": safe_int(r.get("hbp")),
            "bk":  safe_int(r.get("bk")),
            "sfa": safe_int(r.get("sfa")),
            "sha": safe_int(r.get("sha")),
        })
    return out

def main():
    assert os.path.isfile(PDF_PATH), f"PDF not found: {PDF_PATH}"
    print(f"Reading tables from: {PDF_PATH}")

    tables = read_all_tables(PDF_PATH)
    if not tables:
        raise SystemExit("No tables detected. Try different pages or confirm the PDF has text, not scanned images.")

    picks = pick_best_by_class(tables)
    teams_df    = picks.get("teams")
    batting_df  = picks.get("batting")
    pitching_df = picks.get("pitching")

    if teams_df is None or batting_df is None or pitching_df is None:
        print("[warn] Could not auto-detect all tables. Exporting samples to ./database/ for inspection.")
        os.makedirs("database", exist_ok=True)
        for i, df in enumerate(tables, start=1):
            out = f"./database/_table_{i}.csv"
            df.to_csv(out, index=False)
            print("wrote", out)
        raise SystemExit("Please open the CSVs and tell me which ones are Teams/Batting/Pitching so I can lock mapping.")

    # Normalize to your API payload
    teams    = df_to_teams(teams_df)
    batting  = df_to_batting(batting_df)
    pitching = df_to_pitching(pitching_df)

    # Basic sanity prints
    print(f"teams: {len(teams)}, batting rows: {len(batting)}, pitching rows: {len(pitching)}")

    url = f"{API_BASE}/nbc/import"
    payload = {"teams": teams, "batting": batting, "pitching": pitching}
    r = requests.post(url, json=payload, timeout=120)
    try:
        data = r.json()
    except Exception:
        data = {"text": r.text}
    print("Status:", r.status_code)
    print(json.dumps(data, indent=2, default=str))

if __name__ == "__main__":
    main()
