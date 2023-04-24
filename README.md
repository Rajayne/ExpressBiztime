# ExpressBiztime

# Step 1

1. Create database biztime
2. Load seed data from data.sql
3. Connect db.js to database and export Client

# Step 2

Create routes/companies.js with router

- All routes in file fall under /companies
- Routes respond with json
- Ex. get list = {companies: [{code, name}, ...]}

```Required Routes:
GET /companies
GET /companies/[code]
POST /companies
PUT /companies/[code]
DELETE /companies/[code]
```

# Step 3

Add routes/invoices.js

```Required Routes:
GET /invoices
GET /invoices/[id]
POST /invoices
PUT /invoices/[id]
DELETE /invoices/[id]
Update GET /companies/[code] to include invoices
```

# Step 4

Test routes
