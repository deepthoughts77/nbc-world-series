const { Pool } = require("pg");
require("dotenv").config({ path: "backend/.env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const sqlInfo = [
      "select current_database() db,",
      "current_user usr,",
      "inet_server_addr() addr,",
      "inet_server_port() port,",
      "(select setting from pg_settings where name='search_path') as search_path",
    ].join(" ");

    const info = await pool.query(sqlInfo);
    console.log(info.rows[0]);

    const rows = await pool.query(
      "select id,year,start_date,end_date,location from tournaments order by id desc limit 5"
    );
    console.log(rows.rows);
  } finally {
    await pool.end();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
