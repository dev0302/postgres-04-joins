// here using express, pg and neontech string to connect
// npm install pg @types/pg  --> for postgress library for nodejs
// set commonjs to module
// https://console.neon.tech/app/projects/wild-bonus-17359198/branches/br-soft-shape-ai494jvc/tables?database=neondb

// now going more deep to undertand how get id and etc from response and you more than two queries to execute in single row.
// also about transactions

import { Client } from "pg";
import express from "express";
import { promise } from "zod";

const app = express();
app.use(express.json());

const pgClient = new Client("postgresql://neondb_owner:npg_3VgtPwSEXI9Y@ep-quiet-breeze-aizho2ef-pooler.c-4.us-east-1.aws.neon.tech/intro3db?sslmode=verify-full");

pgClient.connect();
console.log("pgClient connected successfully!");

app.post("/signup", async (req,res) => {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    const pincode = req.body.pincode;


    try {
        const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`

        const response = await pgClient.query(insertQuery, [username, email, password]);
        console.log(response);
        

        const insertQuery2 = `INSERT INTO addresses (user_id, city , country, street, pincode) VALUES ($1, $2, $3, $4, $5)`

        const user_id = response.rows[0].id;
        console.log(user_id);
        
        const response2 = await pgClient.query(insertQuery2, [user_id,city,country,street,pincode ]);

        res.json({
            message : "you have signed up"
        });

    } catch (error) {

        console.log(error);
        
        res.json({
            message : "error while signing up"
        });
    }

});



app.post("/transaction", async(req,res) => {

    // transactions: a transaction is a way to run multiple database operations as one single unit of work, meaning, for example, when creating a user and their address together, a transaction ensures that if inserting the address fails, the user insert is rolled back too, keeping the database clean-this is done using `BEGIN` to start, `COMMIT` to save everything if successful, and `ROLLBACK` to undo all changes if any error occurs, making transactions essential for data integrity, especially when tables are related.

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    const pincode = req.body.pincode;


    try {

        const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`

        const insertQuery2 = `INSERT INTO addresses (user_id, city , country, street, pincode) VALUES ($1, $2, $3, $4, $5)`

        await pgClient.query("BEGIN");

        const response = await pgClient.query(insertQuery, [username, email, password]);
        console.log(response);
        
        const user_id = response.rows[0].id;
        console.log(user_id);
        
        const response2 = await pgClient.query(insertQuery2, [user_id,city,country,street,pincode ]);

        await new Promise(x => setTimeout(x,100*1000)); //stop the control on this line for 100s.

        await pgClient.query("COMMIT"); //save both

        res.json({
            message : "you have signed up"
        });

    } catch (error) {

        await pgClient.query("ROLLBACK"); // undo both // REQUIRED 
        console.log(error);
        
        res.json({
            message : "error while signing up"
        });
    }
})

app.get("/metadata", async(req,res) => {
    // req query se id ayega, req.query = data after ? (from url)
    // /route?key=value
    //         ↑
    //         query

    const id = req.query.id;
    console.log("id founddd" + id);
    

    const query1 = `SELECT username,email,id from users WHERE id=$1`;
    const response1 = await pgClient.query(query1, [id]);

    const query2 = `SELECT * from addresses WHERE user_id=$1`;
    const response2 = await pgClient.query(query2, [id]);

    res.json({
        user: response1.rows[0],
        addresses: response2.rows
    })

    // now since the id will be get fetched from query, i.e. url, hence no need of postman here, just do this : localhost:3000/metadata?id=7

})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})




// import { Client } from "pg";
// import express from "express";

// const app = express();
// app.use(express.json());

// const pgClient = new Client("postgresql://neondb_owner:npg_3VgtPwSEXI9Y@ep-quiet-breeze-aizho2ef-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");
// // or by config method

// pgClient.connect();

// app.post("/signup", async (req,res) => {
//     const name = req.body.name;
//     const password_hash = req.body.password_hash;
//     const email = req.body.email;

//     // this query is dangerous and sql injection can be done.
//     const insertQuery = `INSERT INTO users (name, email, password_hash) VALUES ('${name}', '${email}', '${password_hash}');`

//     console.log(insertQuery);

//     const response = await pgClient.query(insertQuery);

//     res.json({
//         message : "you have signed up"
//     })
// })

// app.listen(3000, ()=> {
//     console.log("Server running on port 3000");
// });


// SQL INJECTION
// {
//     "name" : "Dev2",
//     "email" : "Dev262928211@gmail.com",
//     "password_hash" : "12'); DELETE FROM users; INSERT INTO users (name, email, password_hash) VALUES ('Dev100', 'dev100@gmail.com', 'dev9999"
// }