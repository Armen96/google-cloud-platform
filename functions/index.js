const mysql = require('mysql');

exports.validateTemperature = async (req, res) => {
    try {
        if (req.body.hasOwnProperty('temp')) {
            if (req.body.temp < 100) {
                res.status(200).send("Temperature OK");
            } else {
                res.status(200).send("Too hot");
            }
        } else {
            res.status(200).send("Temp missing!");
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

const TYPE = 'cloudsql';
const PROJECT_ID = 'prod-329112';
const REGION = 'us-central1';
const SPANNER_INSTANCE_NAME = 'my-cloud-sql-instance-1';

const pool = mysql.createPool({
    connectionLimit : 1,
    socketPath: `/${TYPE}/${PROJECT_ID}:${REGION}:${SPANNER_INSTANCE_NAME}`,
    user: 'root',
    password: '',
    database: 'todos'
});

exports.getUsersHandler = function handler(req, res) {
    pool.query(`SELECT * FROM users`, req.body, function (e, results) {
        const response = JSON.stringify(results);
        res.status(200).send(response)
    });

    //using pool instead of creating connection with function call
    // pool.query(`SELECT * FROM users where id = ?`,
    //     req.body.id, function (e, results) {
    //         //made reply here
    //     });
};

exports.createUserHandler = function handler(req, res) {
    pool.query(`INSERT INTO users VALUES (2, 'John', 'Bolton')`, req.body, function (e, results) {
        const response = JSON.stringify(results);
        res.status(200).send(response)
    });
};