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

// Week 3 Homework

/*Update the previous GET endpoint `/products` to filter the list of products by name 
using a query parameter, for example `/products?name=Cup`. This endpoint should still 
work even if you don't use the `name` query parameter!*/
app.get("/products", function (req, res) {
    const productNameQuery = req.query.name;
    let query = `SELECT * FROM products`;

    if (productNameQuery) {
        query = `SELECT * FROM products WHERE product_name LIKE '%${productNameQuery}%`;
    }

    pool
        .query(query)
        .then((result) => res.json(result.rows))
        .catch((e) => console.error(e));
});

/*Add a new GET endpoint `/customers/:customerId` to load a single customer by ID.*/
app.get("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;

    pool
        .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
        .then((result) => res.json(result.rows))
        .catch((e) => console.error(e));
});

/* Add a new POST endpoint `/customers` to create a new customer.*/
app.post("/customers", function (req, res) {
    const newCustomerName = req.body.name;
    const newCustomerAddress = req.body.address;
    const newCustomerCity = req.body.city;
    const newCustomerCountry = req.body.country;

    pool
        .query("SELECT * FROM customers WHERE name=$1 address=$2", [newCustomerName, newCustomerAddress])
        .then((result) => {
            if (result.rows.length > 0) {
                return res
                    .status(400)
                    .send("A customer with the same name and address already exists!");
            } else {
                const query =
                    "INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3)";
                pool
                    .query(query, [newCustomerName, newCustomerAddress, newCustomerCity, newCustomerCountry])
                    .then(() => res.send("Customer created"))
                    .catch((e) => console.error(e));
            }
        });
});

/* Add a new POST endpoint `/products` to create a new product 
(with a product name, a price and a supplier id). Check that the price 
is a positive integer and that the supplier ID exists in the database, 
otherwise return an error.*/
app.post("/products", function (req, res) {
    const newProductName = req.body.product_name;
    const newProductPrice = req.body.unit_price;
    const newProductSupplier = req.body.supplier_id;

    if (!Number.isInteger(newProductPrice) && newProductPrice < 0) {
        return res
            .status(400)
            .send("The price should be a positive integer.");
    }

    pool
        .query("SELECT * FROM products WHERE supplier_id=$1", [newProductSupplier]);
        .then((result) => {
            if (result.rows.length > 0) {
                return res
                    .status(400)
                    .send("A supplier with the same supplier ID already exists!");
            } else {
                const query =
                    "INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3)";
                pool
                    .query(query, [newProductName, newProductPrice, newProductSupplier])
                    .then(() => res.send("Product created!"))
                    .catch((e) => console.error(e));
            }
        });
});

/*Add a new POST endpoint `/customers/:customerId/orders` 
to create a new order (including an order date, and an order reference) 
for a customer. Check that the customerId corresponds to an existing 
customer or return an error.*/
app.post("/customers/:customerId/orders", function (req, res) {
    const newOrderDate = req.body.order_date;
    const newOrderReference = req.body.order_reference;
    const customerId = req.body.customer_id;

    if (customerId !== customers.id) {
        return res
            .status(400)
            .send("Customer ID does not exist! Please create a new customer.");
    }

    const query =
        "INSERT INTO orders (order_date, order_reference, customer_id) VALUES ($1, $2, $3)";

    pool
        .query(query, [newOrderDate, newOrderReference, customerId])
        .then(() => res.send("Order created!"))
        .catch((e) => console.error(e));
});

/*Add a new PUT endpoint `/customers/:customerId` to update 
an existing customer (name, address, city and country).*/
app.put("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
    const newCustomerName = req.body.name;
    const newCustomerAddress = req.body.address;
    const newCustomerCity = req.body.city;
    const newCustomerCountry = req.body.country;

    pool
        .query("UPDATE customers SET name=$1 address=$2 city=$3 country=$4 WHERE id=$5", [newCustomerName, newCustomerAddress, newCustomerCity, newCustomerCountry, customerId])
        .then(() => res.send(`Customer ${customerId} updated!`))
        .catch((e) => console.error(e));
});

/*Add a new DELETE endpoint `/orders/:orderId` to delete an 
existing order along all the associated order items.*/
app.delete("/orders/:orderId", function (req, res) {
    const orderId = req.params.orderId;

    pool
        .query("DELETE FROM orders WHERE id=$1", [orderId])
        .then(() => res.send(`Order ${orderId} deleted!`))
        .catch((e) => console.error(e));
});

/*Add a new DELETE endpoint `/customers/:customerId` to delete 
an existing customer only if this customer doesn't have orders.*/
app.delete("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
    let ordersCustomerId = `SELECT customer_id FROM orders`;

    if (customerId == ordersCustomerId) {
        return res
            .status(400)
            .send("The customer cannot be deleted as they have an existing order.");
    }

    pool
        .query("DELETE FROM customers WHERE id=$1", [customerId])
        .then(() => res.send(`Customer ${customerId} deleted!`))
        .catch((e) => console.error(e));
});

/*Add a new GET endpoint `/customers/:customerId/orders` to load all 
the orders along the items in the orders of a specific customer. 
Especially, the following information should be returned: 
order references, order dates, product names, unit prices, suppliers 
and quantities.*/
app.get("/customers/:customerId/orders", function (req, res) {
    const customerId = req.params.customerId;
    let query = `SELECT order_reference, order_date, products.product_name, products.unit_price, suppliers.supplier_name, order_items.quantity FROM orders 
                INNER JOIN order_items ON order_items.id=orders.id 
                INNER JOIN products ON products.id=order_items.product_id 
                INNER JOIN suppliers on suppliers.id=products.supplier_id 
                WHERE customer_id = ${customerId}`;
    
    pool
        .query(query)
        .then((result) => res.json(result.rows))
        .catch((e) => console.error(e));
});

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});