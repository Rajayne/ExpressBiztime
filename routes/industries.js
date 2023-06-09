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

router.get("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;
    const industryByCode = await db.query(
      `SELECT * FROM industries WHERE code=$1`,
      [code]
    );
    const companiesRes = await db.query(
      `SELECT company_code FROM company_industries WHERE industry_code=$1`,
      [code]
    );
    const industry = industryByCode.rows[0];
    const companies = companiesRes.rows;
    console.log(companiesRes.rows);
    industry.companies = companies.map((c) => c.company_code);
    return res.json({ industry: industry });
  } catch (e) {
    return next(e);
  }
});

router.post("/:code", async (req, res, next) => {
  try {
    const { company_code } = req.body;
    const industry_code = req.params.code;
    console.log(`Company: ${company_code}, Industry: ${industry_code}`);
    const companyIndustry = await db.query(
      `INSERT INTO company_industries (company_code, industry_code) VALUES ($1, $2) RETURNING *`,
      [company_code, industry_code]
    );
    return res.json({ company_industry: companyIndustry.rows[0] });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
