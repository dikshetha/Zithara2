const { Client } = require('pg');
const bodyParser = require('body-parser');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 3030
});

async function connect() {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
}

async function query(queryString) {
    try {
        const result = await client.query(queryString);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

function disconnect() {
    client.end();
    console.log('Disconnected from the database');
}

// Middleware to parse JSON bodies
const jsonParser = bodyParser.json();

module.exports = {
    connect,
    query,
    disconnect,
    jsonParser
};
