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

router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const companyByCode = await db.query(
      `SELECT * FROM companies WHERE code=$1`,
      [code]
    );
    if (companyByCode.rows.length === 0) {
      throw new ExpressError(`No company found with code of ${code}`, 404);
    }
    return res.json({ company: companyByCode.rows[0] });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
