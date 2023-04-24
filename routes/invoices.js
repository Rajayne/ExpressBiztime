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

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id]);
    if (invoice.rows.length === 0) {
      throw new ExpressError(`No invoice found with id of ${id}`, 404);
    }
    return res.json({ invoice: invoice.rows });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
