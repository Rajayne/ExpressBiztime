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

1. Test routes, use jest –coverage.
2. Slugify Company Names
   - Read about slugify then change the POST /companies route so that they don’t provide a code directly, but you make this by using slugify() on the given name.
3. Allow paying of invoices
4. Change the logic of PUT /invoices/[id] to update an invoice.

   - If invoice cannot be found, returns a 404.
   - Needs to be passed in a JSON body of {amt, paid}
   - If paying unpaid invoice: sets paid_date to today
   - If un-paying: sets paid_date to null
   - Else: keep current paid_date
   - Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

5. Add a Many-to-Many

   - Add a table for “industries”, where there is a code and an industry field (for example: “acct” and “Accounting”).
   - Add a table that allows an industry to be connected to several companies and to have a company belong to several industries.
   - Add some sample data (by hand in psql is fine).

6. Change GET /companies/[id]
   When viewing details for a company, you can see the names of the industries for that company
   ```
   Add routes for:
   - adding an industry
   - listing all industries, which should show the company code(s) for that industry
   - associating an industry to a company
   ```
