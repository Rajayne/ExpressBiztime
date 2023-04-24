const { Client } = require("pg");
const { user, password } = require(".../dbPassword");

let DB_URI =
  process.env.NODE_ENV === "test"
    ? `postgresql://${user}:${password}@localhost:5432/biztime_test`
    : `postgresql://${user}:${password}@localhost:5432/biztime`;

let db = new Client({
  connectionString: DB_URI,
});

db.connect();

module.exports = db;
