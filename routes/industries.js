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

module.exports = router;
