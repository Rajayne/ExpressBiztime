const request = require("supertest");
const app = require("../app");

process.env.NODE_ENV = "test";
const db = require("../db");

let testCompany;

// Create new company in db before each test
beforeEach(async () => {
  const company = await db.query(
    `INSERT INTO companies (code, name, description) VALUES ('google', 'Google', 'Internet search engine.') RETURNING *`
  );
  testCompany = company.rows[0];
});

afterEach(async () => {
  await db.query(`DELETE FROM companies`);
  await db.query(`DELETE FROM invoices`);
});

afterAll(async () => {
  await db.end();
});

describe("Test beforeEach", () => {
  test("Create testCompany", () => {
    expect(1).toBe(1);
  });
});

describe("Companies Router Tests", () => {
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

  describe("POST /companies", () => {
    test("Create a new company", async () => {
      const result = await request(app).post(`/companies`).send({
        code: "fast",
        name: "FAST Enterprises",
        description: "Develops and installs software for government agencies.",
      });
      expect(result.statusCode).toBe(201);
      expect(result.body).toEqual({
        company: {
          code: "fast",
          name: "FAST Enterprises",
          description:
            "Develops and installs software for government agencies.",
        },
      });
    });
  });

  describe("PUT /companies/:code", () => {
    test("Edit a company", async () => {
      const result = await request(app)
        .put(`/companies/${testCompany.code}`)
        .send({
          name: "FAST Enterprises",
          description:
            "Develops and installs software for government agencies.",
        });
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual({
        company: {
          code: "google",
          name: "FAST Enterprises",
          description:
            "Develops and installs software for government agencies.",
        },
      });
    });
  });

  describe("DELETE /companies/:code", () => {
    test("Delete a single company", async () => {
      const result = await request(app).delete(
        `/companies/${testCompany.code}`
      );
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual({ status: `Deleted!` });
    });
  });
});

describe("Invoices Router Tests", () => {
  describe("GET /invoices", () => {
    test("Get all invoices", async () => {
      const result = await request(app).get(`/invoices`);
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual({
        invoices: [],
      });
    });
  });
  describe("POST /invoices", () => {
    test("Create a new invoice", async () => {
      const result = await request(app)
        .post(`/invoices`)
        .send({
          comp_code: `${testCompany.code}`,
          amt: 500,
        });
      expect(result.statusCode).toBe(201);
      expect(result.body).toEqual({
        invoice: {
          id: expect.any(Number),
          comp_code: testCompany.code,
          amt: 500,
          paid: false,
          add_date: expect.anything(),
          paid_date: null,
        },
      });
    });
  });
});

//`SELECT id, comp_code FROM invoices`
