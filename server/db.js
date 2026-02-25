const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

async function connectDB() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");
  }
  return pool;
}

module.exports = { connectDB, sql };