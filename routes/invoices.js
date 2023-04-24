const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");
const { request } = require("../app");

router.get("/", async (req, res, next) => {
  try {
    const invoices = await db.query(`SELECT id, comp_code FROM invoices`);
    return res.json({ invoices: invoices.rows });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
