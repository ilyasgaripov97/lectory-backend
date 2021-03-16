const pg = require('pg');


const pool = new pg.Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    max: 25,
    idleTimeoutMillis: 30000
})

module.exports = {
    pool
}