// When developing and not in production mode, use below
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
 
const express = require("express");
const app = express();

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: process.env.DBPASSWORD,
    port: 5432
});

// Add a new GET endpoint `/customers` to load all the customers from the database
app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});

// Add a new GET endpoint `/suppliers` to load all the suppliers from the database
app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});

//(STRETCH GOAL) Add a new GET endpoint `/products` to load all the product names along with their supplier names.
app.get("/products", function(req, res) {
    pool.query(
        'SELECT product_name, supplier_name FROM products INNER JOIN suppliers ON suppliers.id = products.supplier_id',
        (error, result) => {
            res.json(result.rows);
        }
    );
});

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});