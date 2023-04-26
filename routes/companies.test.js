const request = require("supertest");
const app = require("../app");

process.env.NODE_ENV = "test";
const db = require("../db");

let testCompany;

// Create new company in db before each test
beforeEach(async () => {
  const test = await db.query(
    `INSERT INTO companies (code, name, description) VALUES ('google', 'Google', 'Internet search engine.') RETURNING *`
  );
  testCompany = test.rows[0];
});

afterEach(async () => {
  await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
  await db.end();
});

describe("Test beforeEach", () => {
  test("Create testCompany", () => {
    expect(1).toBe(1);
  });
});

describe("GET /companies", () => {
  test("Get list of all companies", async () => {
    const result = await request(app).get("/companies");
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      companies: [{ code: testCompany.code, name: testCompany.name }],
    });
  });
});

describe("GET /companies/:code", () => {
  test("Get a single company", async () => {
    const result = await request(app).get(`/companies/${testCompany.code}`);
    expect(result.statusCode).toBe(200);
    // Set testCompany invoices to empty array
    testCompany.invoices = [];
    expect(result.body).toEqual({
      company: testCompany,
    });
  });
});
