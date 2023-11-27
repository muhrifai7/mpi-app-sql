import sql from "mssql";
// const sql = require('mssql');

export default async (req, res) => {
    // Database configuration
    const config = {
        user: 'sa',
        password: 'P@ssw0rd',
        server: 'localhost',
        database: 'master',
        options: {
            trustedConnection : true,
            encrypt: true, // Use this if you're on Windows Azure
        },
    };

    // Connect to the database
    const pool = new sql.ConnectionPool(config);
    pool.connect().then(() => {
        //simple query
        pool.request().query('select * from tbl_user', (err, result) => {
            if(err) res.send(err)
            else{
                return res.json({
                    data : result.recordset
                })
            }
        })
        sql.close();
    });
    console.log('ending sql');
};