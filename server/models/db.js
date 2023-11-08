import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'httprequest',
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

export default connection;
