const request = require("supertest");
const app = require("../app");

process.env.NODE_ENV = "test";
const db = require("../db");

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

describe("GET /companies", () => {
  test("Get list of all companies", async () => {
    const result = await request(app).get("/companies");
    expect(result.statusCode).toBe(200);
    console.log(result.rows);
    expect(result.body).toEqual({
      companies: [{ code: testCompany.code, name: testCompany.name }],
    });
  });
});
