// here using express, pg and neontech string to connect
// npm install pg @types/pg  --> for postgress library for nodejs
// set commonjs to module
// https://console.neon.tech/app/projects/wild-bonus-17359198/branches/br-soft-shape-ai494jvc/tables?database=intro3db

// transactions done
// now moving towards joins
// A JOIN is used to combine rows from two or more tables based on a related column (usually a foreign key).

import { Client } from "pg";
import express from "express";

const app = express();
app.use(express.json());

const pgClient = new Client("postgresql://neondb_owner:npg_3VgtPwSEXI9Y@ep-quiet-breeze-aizho2ef-pooler.c-4.us-east-1.aws.neon.tech/intro3db?sslmode=verify-full");

pgClient.connect();
console.log("pgClient connected successfully!");

try {

    const joinQuery = `SELECT * FROM users INNER JOIN addresses ON users.id = addresses.user_id;`;
    const response = await pgClient.query(joinQuery);
    console.log(response.rows);
    
} catch (error) {
    console.log("ERORRRRRRRR");
    console.log(error);
}

app.listen(3000, () => {
    console.log("Server running on port 3000");
})


// 1️⃣ INNER JOIN (most common)
// Returns only matching rows from both tables.

// SELECT *
// FROM users
// INNER JOIN addresses
// ON users.id = addresses.user_id;



// 2️⃣ LEFT JOIN (LEFT OUTER JOIN)
// Returns all rows from left table + matching rows from right table.
// If no match → NULL.

// SELECT *
// FROM users
// LEFT JOIN addresses
// ON users.id = addresses.user_id;



// 4️⃣ FULL JOIN (FULL OUTER JOIN)
// Returns all rows from both tables.
// If no match → NULL.

// SELECT *
// FROM users
// FULL JOIN addresses
// ON users.id = addresses.user_id;



// 5️⃣ CROSS JOIN
// Returns every combination (cartesian product).

// SELECT *
// FROM users
// CROSS JOIN addresses;