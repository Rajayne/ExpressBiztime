const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get("/", async (req, res, next) => {
  try {
    const industries = await db.query(`SELECT * FROM industries`);
    return res.json({ industries: industries.rows });
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { code, industry } = req.body;
    const newIndustry = await db.query(
      `INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *`,
      [code, industry]
    );
    return res.json({ industry: newIndustry.rows[0] });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
