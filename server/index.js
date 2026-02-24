const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectDB, sql } = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 7000;
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
if (!process.env.JWT_SECRET) console.warn("⚠️ JWT_SECRET not set, using default dev secret");

/* =====================
   REGISTER
===================== */
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const pool = await connectDB();

  await pool.request()
    .input("username", sql.NVarChar, username)
    .input("email", sql.NVarChar, email)
    .input("password", sql.NVarChar, hash)
    .query(`
      INSERT INTO Users(username,email,password_hash)
      VALUES(@username,@email,@password)
    `);

  res.json({ message: "User created" });
});

/* =====================
   LOGIN
===================== */
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const pool = await connectDB();

  const result = await pool.request()
    .input("username", sql.NVarChar, username)
    .query(`SELECT * FROM Users WHERE username=@username`);

  const user = result.recordset[0];
  if (!user) return res.status(400).json({ message: "User not found" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET);

  res.json({ token });
});

/* =====================
   GET POSTS
===================== */
app.get("/api/posts", async (req, res) => {
  const pool = await connectDB();

  const result = await pool.request().query(`
    SELECT activity_id, title, description, created_at
    FROM Activities
    ORDER BY created_at DESC
  `);

  res.json(result.recordset);
});

/* =====================
   CREATE POST
===================== */
app.post("/api/posts", async (req, res) => {
  const { title, description } = req.body;
  const pool = await connectDB();

  await pool.request()
    .input("title", sql.NVarChar, title)
    .input("description", sql.NVarChar, description)
    .query(`
      INSERT INTO Activities(title,description,creator_id,status)
      VALUES(@title,@description,1,'approved')
    `);

  res.json({ message: "Post created" });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);