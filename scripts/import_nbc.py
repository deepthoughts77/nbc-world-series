# scripts/import_nbc.py
import os
import json
import pandas as pd
import requests

# ====== CONFIG: edit these ======
PDF_PATH   = r"C:\Users\erico\Documents\Final 2025 team stax (1).pdf"  # only used for reference
API_BASE   = "http://localhost:5000/api"
SEASON_KEY = "NBC-2025"

# If you exported tables to CSVs, set them here:
CSV_TEAMS    = r"C:\Users\erico\nbc-world-series\database\teams_2025.csv"
CSV_BATTING  = r"C:\Users\erico\nbc-world-series\database\batting_2025.csv"
CSV_PITCHING = r"C:\Users\erico\nbc-world-series\database\pitching_2025.csv"
# =================================

def safe_int(x):
    try:
        return int(str(x).strip()) if str(x).strip() != "" else None
    except:
        return None

def safe_float(x):
    try:
        return float(str(x).strip()) if str(x).strip() != "" else None
    except:
        return None

def load_teams(path):
    """
    Expected columns (case-insensitive, flexible names):
      name, pool, record, home/home_record, away/away_record
    """
    df = pd.read_csv(path)
    lower = {c: c.lower() for c in df.columns}
    df.rename(columns=lower, inplace=True)

    def pick(*names):
        for n in names:
            if n in df.columns:
                return df[n]
        return None

    teams = []
    for _, row in df.iterrows():
        teams.append({
            "name":     str(row.get("name", "")).strip(),
            "pool":     str(row.get("pool", "")).strip() or None,
            "record":   str(row.get("record", "")).strip() or None,
            "home":     (str(pick("home_record","home") or "")).strip() or None,
            "away":     (str(pick("away_record","away") or "")).strip() or None,
        })
    return teams

def load_batting(path):
    """
    Expected columns (flexible):
      team_name, jersey_no, name, gp, gs, ab, r, h, 2b, 3b, hr, rbi, tb, slg, bb, hbp, so,
      gdp, obp, sf, sh, sb, att
    """
    df = pd.read_csv(path)
    df.columns = [c.lower() for c in df.columns]

    # map some common header variants
    col = lambda *opts: next((o for o in opts if o in df.columns), None)

    batting = []
    for _, r in df.iterrows():
        batting.append({
            "team_name":  str(r.get(col("team_name","team","teamname"), "")).strip(),
            "jersey_no":  safe_int(r.get(col("jersey_no","number","#","jersey"), None)),
            "name":       str(r.get(col("name","player","player_name"), "")).strip(),
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
            "att": safe_int(r.get(col("att","sb_att","attempts"), None)),
        })
    return batting

def load_pitching(path):
    """
    Expected columns (flexible):
      team_name, jersey_no, name, era, w, l, app, gs, cg, sho, cbo, sv,
      ip, h, r, er, bb, so, 2b, 3b, hr, wp, hbp, bk, sfa, sha
    """
    df = pd.read_csv(path)
    df.columns = [c.lower() for c in df.columns]
    col = lambda *opts: next((o for o in opts if o in df.columns), None)

    pitching = []
    for _, r in df.iterrows():
        pitching.append({
            "team_name":  str(r.get(col("team_name","team","teamname"), "")).strip(),
            "jersey_no":  safe_int(r.get(col("jersey_no","number","#","jersey"), None)),
            "name":       str(r.get(col("name","player","player_name"), "")).strip(),
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
    return pitching

def main():
    # Load CSVs
    teams    = load_teams(CSV_TEAMS)
    batting  = load_batting(CSV_BATTING)
    pitching = load_pitching(CSV_PITCHING)

    payload = {"teams": teams, "batting": batting, "pitching": pitching}

    url = f"{API_BASE}/nbc/import"
    print(f"POST {url} with {len(teams)} teams, {len(batting)} batting rows, {len(pitching)} pitching rows")

    resp = requests.post(url, json=payload, timeout=120)
    try:
        data = resp.json()
    except Exception:
        data = {"text": resp.text}
    print("Status:", resp.status_code)
    print(json.dumps(data, indent=2, default=str))

if __name__ == "__main__":
    main()
