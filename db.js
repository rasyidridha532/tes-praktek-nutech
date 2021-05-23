const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'u2j2bc8g82jn9',
    password: 'p7770cc0af1393a16f047bf5ade8f57f78a22249ab5cf8e7b528cc79a58e090cb',
    database: 'd67ebs0n1pkdma',
    host: 'ec2-3-221-219-145.compute-1.amazonaws.com',
    port: '5432',
    ssl: {
        rejectUnauthorized: false,
    }
});

module.exports = pool;
