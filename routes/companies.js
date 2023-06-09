const express = require("express");
const router = express.Router();
const db = require("../db");
// const slugify = require("slugify");
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
    const invoicesResult = await db.query(
      `SELECT id FROM invoices WHERE comp_code=$1`,
      [code]
    );
    const industryResult = await db.query(
      `SELECT industry_code FROM company_industries WHERE company_code=$1`,
      [code]
    );
    const company = companyByCode.rows[0];
    const invoices = invoicesResult.rows;
    const industries = industryResult.rows;
    company.invoices = invoices.map((inv) => inv.id);
    company.industries = industries.map((ind) => ind.industry_code);
    return res.json({ company: company });
  } catch (e) {
    return next(e);
  }
});

/* 
SQL query to join all tables
---
SELECT c.code, c.name, c.description, i.id AS invoice_id, d.industry AS industry 
FROM companies c
JOIN company_industries ci
	ON c.code = ci.company_code
JOIN industries d
	ON d.code = ci.industry_code
JOIN invoices i 
	ON c.code = i.comp_code 
WHERE c.code='apple';
*/

router.post("/", async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const newCompany = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`,
      [code, name, description]
    );
    return res.status(201).json({ company: newCompany.rows[0] });
  } catch (e) {
    return next(e);
  }
});

/* Using slugify
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newCompany = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`,
      [slugify(name), name, description]
    );
    return res.status(201).json({ company: newCompany.rows[0] });
  } catch (e) {
    return next(e);
  }
});
*/

router.put("/:code", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { code } = req.params;
    const companyByCode = await db.query(
      `UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *`,
      [name, description, code]
    );
    if (companyByCode.rows.length === 0) {
      throw new ExpressError(`No company found with code of ${code}`, 404);
    }
    return res.json({ company: companyByCode.rows[0] });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:code", async (req, res, next) => {
  const { code } = req.params;
  try {
    const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [
      code,
    ]);
    if (company.rows.length === 0) {
      throw new ExpressError(`No company found with code of ${code}`, 404);
    } else {
      db.query(`DELETE FROM companies WHERE code=$1`, [code]);
      return res.send({ status: `Deleted!` });
    }
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
