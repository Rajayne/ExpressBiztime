const express = require("express");
const router = express.Router();

process.env.NODE_ENV = "test";
const db = require("../db");
const ExpressError = require("../expressError");

let testCompany = {
  code: "google",
  name: "Google",
  description: "Internet search engine.",
};

// Create new company in db before each test
beforeEach(async () => {
  const { code, name, description } = testCompany;
  const test = await db.query(
    `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`,
    [code, name, description]
  );
  testUser = test.rows[0];
});

afterEach(async () => {
  await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
  await db.end();
});

describe("Test beforeEach", () => {
  test("Create testCompany", () => {
    console.log(testCompany);
    expect(1).toBe(1);
  });
});
