import pkg from "pg";
import 'dotenv/config'
const { Pool } = pkg;

const db = new Pool({
  /* These lines of code are setting up the configuration for connecting to a PostgreSQL database using
  the `pg` package in Node.js. */
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL || true,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

 const query = async (text, params) => {
  const start = Date.now()
  const res = await db.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

export default query