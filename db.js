const { createPool } = require('mysql2/promise');
const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'De_dust2',
    port: 3306,
    database: 'lab3'
});
 module.exports = pool;
