import mySql from "mysql2/promise.js";

const pool = mySql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: "",
    database: process.env.DATABASE
})

export default pool;

