const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const port = 4000;
app.use(cors('*'))

// PostgreSQL connection configuration
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 3030
});

// Connect to the database
client.connect();

app.get('/', (req, res) => {
    res.send('Welcome to my API'); // You can send any response you want here
});

// Define a route to fetch data from the database
// app.get('/customers', (req, res) => {
//     client.query('SELECT * FROM customers', (err, result) => {
//         if (err) {
//             console.error('Error executing query', err.stack);
//             res.status(500).send('Internal Server Error');
//         } else {
//             res.json(result.rows);
//         }
//     });
// });

// app.get('/customers', async (req, res) => {
//     try {
//         const { page = 1, limit = 20 } = req.query;

//         const totalCountQuery = await client.query('SELECT COUNT(*) FROM customers');
//         const totalCount = parseInt(totalCountQuery.rows[0].count);

//         const offset = (page - 1) * limit;
//         const query = {
//             text: 'SELECT * FROM customers OFFSET $1 LIMIT $2',
//             values: [offset, limit]
//         };
//         const result = await client.query(query);

//         res.json({
//             total: totalCount,
//             page: parseInt(page),
//             limit: parseInt(limit),
//             data: result.rows,
//             totalPages: Math.ceil(totalCount/+limit)
//         });
//     } catch (error) {
//         console.error('Error executing query:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });



app.get('/customers', async (req, res) => {
    try {
        const { page = 1, limit = 20, sort = 'asc' } = req.query;

        const totalCountQuery = await client.query('SELECT COUNT(*) FROM customers');
        const totalCount = parseInt(totalCountQuery.rows[0].count);

        const offset = (page - 1) * limit;
        let queryText = 'SELECT * FROM customers';
        let queryValues = [];

        if (sort.toLowerCase() === 'asc') {
            queryText += ' ORDER BY created_at ASC';
        } else if (sort.toLowerCase() === 'desc') {
            queryText += ' ORDER BY created_at DESC';
        }

        queryText += ' OFFSET $1 LIMIT $2';
        queryValues = [offset, limit];

        const result = await client.query({
            text: queryText,
            values: queryValues
        });

        res.json({
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            data: result.rows,
            totalPages: Math.ceil(totalCount / +limit)
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
