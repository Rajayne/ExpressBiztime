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
    const result = await db.query(
      `SELECT i.id, 
                i.comp_code, 
                i.amt, 
                i.paid, 
                i.add_date, 
                i.paid_date, 
                c.name, 
                c.description 
         FROM invoices AS i
           INNER JOIN companies AS c ON (i.comp_code = c.code)  
         WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`No invoice found with id of ${id}`, 404);
    }
    const data = result.rows[0];
    const invoice = {
      id: data.id,
      company: {
        code: data.comp_code,
        name: data.name,
        description: data.description,
      },
      amt: data.amt,
      paid: data.paid,
      add_date: data.add_date,
      paid_date: data.paid_date,
    };
    return res.json({ invoice: invoice });
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const newInvoice = await db.query(
      `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: newInvoice.rows[0] });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
