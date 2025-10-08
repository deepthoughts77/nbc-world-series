// src/routes/nbcImport.js
const express = require("express");
const pool = require("../config/database"); // reuse shared Pool

const router = express.Router();

router.post("/nbc/import", async (req, res) => {
  // tolerate missing keys; keep shapes predictable
  const { teams = [], batting = [], pitching = [] } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const teamIdByName = new Map();

    // Upsert teams
    for (const t of teams) {
      const r = await client.query(
        `INSERT INTO teams (name, pool, record, home_record, away_record)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (name) DO UPDATE
         SET pool = EXCLUDED.pool,
             record = EXCLUDED.record,
             home_record = EXCLUDED.home_record,
             away_record = EXCLUDED.away_record
         RETURNING id`,
        [t.name, t.pool, t.record, t.home, t.away]
      );
      teamIdByName.set(t.name, r.rows[0].id);
    }

    // helper to upsert a player and return id
    const upsertPlayer = async (teamName, jersey_no, name) => {
      const tid = teamIdByName.get(teamName);
      if (!tid)
        throw new Error(`Team not found for player: ${teamName} / ${name}`);
      const r = await client.query(
        `INSERT INTO players (team_id, jersey_no, name)
         VALUES ($1,$2,$3)
         ON CONFLICT (team_id, name) DO UPDATE
         SET jersey_no = EXCLUDED.jersey_no
         RETURNING id`,
        [tid, jersey_no || null, name]
      );
      return r.rows[0].id;
    };

    // Upsert batting
    for (const b of batting) {
      const pid = await upsertPlayer(b.team_name, b.jersey_no, b.name);
      await client.query(
        `INSERT INTO batting_stats
         (player_id, season_key, gp, gs, ab, r, h, "2b","3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
         ON CONFLICT (player_id, season_key) DO UPDATE
         SET gp=EXCLUDED.gp, gs=EXCLUDED.gs, ab=EXCLUDED.ab, r=EXCLUDED.r, h=EXCLUDED.h,
             "2b"=EXCLUDED."2b","3b"=EXCLUDED."3b", hr=EXCLUDED.hr, rbi=EXCLUDED.rbi, tb=EXCLUDED.tb,
             slg=EXCLUDED.slg, bb=EXCLUDED.bb, hbp=EXCLUDED.hbp, so=EXCLUDED.so, gdp=EXCLUDED.gdp,
             obp=EXCLUDED.obp, sf=EXCLUDED.sf, sh=EXCLUDED.sh, sb=EXCLUDED.sb, att=EXCLUDED.att`,
        [
          pid,
          b.season_key,
          b.gp,
          b.gs,
          b.ab,
          b.r,
          b.h,
          b["2b"],
          b["3b"],
          b.hr,
          b.rbi,
          b.tb,
          b.slg,
          b.bb,
          b.hbp,
          b.so,
          b.gdp,
          b.obp,
          b.sf,
          b.sh,
          b.sb,
          b.att,
        ]
      );
    }

    // Upsert pitching
    for (const p of pitching) {
      const pid = await upsertPlayer(p.team_name, p.jersey_no, p.name);
      await client.query(
        `INSERT INTO pitching_stats
         (player_id, season_key, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b","3b", hr, wp, hbp, bk, sfa, sha)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
         ON CONFLICT (player_id, season_key) DO UPDATE
         SET era=EXCLUDED.era, w=EXCLUDED.w, l=EXCLUDED.l, app=EXCLUDED.app, gs=EXCLUDED.gs,
             cg=EXCLUDED.cg, sho=EXCLUDED.sho, cbo=EXCLUDED.cbo, sv=EXCLUDED.sv, ip=EXCLUDED.ip,
             h=EXCLUDED.h, r=EXCLUDED.r, er=EXCLUDED.er, bb=EXCLUDED.bb, so=EXCLUDED.so,
             "2b"=EXCLUDED."2b","3b"=EXCLUDED."3b", hr=EXCLUDED.hr, wp=EXCLUDED.wp,
             hbp=EXCLUDED.hbp, bk=EXCLUDED.bk, sfa=EXCLUDED.sfa, sha=EXCLUDED.sha`,
        [
          pid,
          p.season_key,
          p.era,
          p.w,
          p.l,
          p.app,
          p.gs,
          p.cg,
          p.sho,
          p.cbo,
          p.sv,
          p.ip,
          p.h,
          p.r,
          p.er,
          p.bb,
          p.so,
          p["2b"],
          p["3b"],
          p.hr,
          p.wp,
          p.hbp,
          p.bk,
          p.sfa,
          p.sha,
        ]
      );
    }

    await client.query("COMMIT");
    return res.json({ ok: true });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  } finally {
    client.release();
  }
});

module.exports = router;
