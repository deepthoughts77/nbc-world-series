// frontend/src/constants/stats.js

// 🟦 Batting columns – match player_stats_all view
// player_stats_all fields:
// id, year, team_name, player_name, avg, gp, gs, ab, r, h, "2b", "3b",
// hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, po, a, e, fld

export const battingStatColumns = [
  { key: "avg", label: "AVG" },
  { key: "gp", label: "G" },
  { key: "gs", label: "GS" },
  { key: "ab", label: "AB" },
  { key: "r", label: "R" },
  { key: "h", label: "H" },
  { key: "2b", label: "2B" },
  { key: "3b", label: "3B" },
  { key: "hr", label: "HR" },
  { key: "rbi", label: "RBI" },
  { key: "tb", label: "TB" },
  { key: "slg", label: "SLG" },
  { key: "bb", label: "BB" },
  { key: "hbp", label: "HBP" },
  { key: "so", label: "SO" },
  { key: "gdp", label: "GDP" },
  { key: "obp", label: "OBP" },
  { key: "sf", label: "SF" },
  { key: "sh", label: "SH" },
  { key: "sb", label: "SB" },
  { key: "att", label: "ATT" },
  { key: "po", label: "PO" },
  { key: "a", label: "A" },
  { key: "e", label: "E" },
  { key: "fld", label: "FLD%" },
];

// 🟥 Pitching columns – match pitching_stats_all view
// pitching_stats_all fields (what we defined in SQL):
// id, year, team_name, player_name, g, w, l, ip, h, r, er, bb, so, hr, rbi, wp, hbp

// PITCHING columns – matching the NBC PDF order
// src/constants/stats.js

// Existing battingStatColumns stays as it is

export const pitchingStatColumns = [
  { key: "era", label: "ERA" },
  { key: "w", label: "W" },
  { key: "l", label: "L" },
  { key: "app", label: "APP" },
  { key: "gs", label: "GS" },
  { key: "cg", label: "CG" },
  { key: "sho", label: "SHO" },
  { key: "cbo", label: "CBO" },
  { key: "sv", label: "SV" },
  { key: "ip", label: "IP" },
  { key: "h", label: "H" },
  { key: "r", label: "R" },
  { key: "er", label: "ER" },
  { key: "bb", label: "BB" },
  { key: "so", label: "SO" },
  { key: "doubles", label: "2B" }, // if your column is literally "2b", see note below
  { key: "triples", label: "3B" }, // same note
  { key: "hr", label: "HR" },
  { key: "ab", label: "AB" },
  { key: "b_avg", label: "B AVG" },
  { key: "wp", label: "WP" },
  { key: "hbp", label: "HBP" },
  { key: "bk", label: "BK" },
  { key: "sfa", label: "SFA" },
  { key: "sha", label: "SHA" },
];
