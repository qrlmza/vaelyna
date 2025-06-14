const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_ADDR,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const analiDb = mysql.createPool({
    host: process.env.DB_ADDR,
    port: process.env.DB_PORT,
    user: process.env.ANALI_USER,
    password: process.env.ANALI_PASS,
    database: process.env.ANALI_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
module.exports = analiDb.promise();
