const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get("/", async (req, res, next) => {
  try {
    const companies = await db.query(`SELECT code, name FROM companies`);
    return res.json({ companies: companies.rows });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
