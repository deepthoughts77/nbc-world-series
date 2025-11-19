import pdfplumber
import pandas as pd
import re

pdf_path = "data/1966_NBC_playerstats.pdf"
rows = []
year = 1966
team = None

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        lines = page.extract_text().splitlines()
        for line in lines:
            line = line.strip()

            # Detect team header (e.g., BOULDER (COLO.) COLLEGIANS (7-1))
            if re.match(r"^[A-Z].*\(\d+-\d+\)", line):
                team = line.strip()
                continue

            # Match player rows: Name, position, then numbers ending with a pct
            # Example: "Riddock, ss _____________ 8 31 3 7 1 0 1 1 0 5 4 23 0 .228"
            m = re.match(
                r"^([A-Za-z\.\'\-\s]+),\s*([A-Za-z0-9]+)\s+[_\s]+([\d\s\.]+)$", line
            )

            if m:
                name, position, rest = m.groups()

                # Split numeric stats and handle percentages properly
                tokens = [t for t in rest.split() if re.match(r"[\d\.]+", t)]

                # Ensure consistent length (fill with None if short)
                stats = tokens + [None] * (15 - len(tokens))

                rows.append({
                    "year": year,
                    "team_name": team,
                    "player_name": name.strip(),
                    "position": position.strip(),
                    "G": stats[0] if len(stats) > 0 else None,
                    "AB": stats[1] if len(stats) > 1 else None,
                    "R": stats[2] if len(stats) > 2 else None,
                    "H": stats[3] if len(stats) > 3 else None,
                    "2B": stats[4] if len(stats) > 4 else None,
                    "3B": stats[5] if len(stats) > 5 else None,
                    "HR": stats[6] if len(stats) > 6 else None,
                    "SB": stats[7] if len(stats) > 7 else None,
                    "SH": stats[8] if len(stats) > 8 else None,
                    "RBI": stats[9] if len(stats) > 9 else None,
                    "PO": stats[10] if len(stats) > 10 else None,
                    "A": stats[11] if len(stats) > 11 else None,
                    "E": stats[12] if len(stats) > 12 else None,
                    "Pct": stats[13] if len(stats) > 13 else None,
                })

df = pd.DataFrame(rows)
print(df.head(10))
df.to_csv("data/playerstats_1966_raw.csv", index=False)
print(f"\n✅ Extracted {len(df)} player rows to data/playerstats_1966_raw.csv")
