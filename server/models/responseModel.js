import connection from './db.js';

const createTableIfNotExists = () => {
  const sql = `CREATE TABLE IF NOT EXISTS responses (
    id int NOT NULL AUTO_INCREMENT,
    request_id INT,
    version VARCHAR(50),
    statusCode INT,
    statusMessage VARCHAR(255),
    location VARCHAR(255),
    serverName VARCHAR(255),
    serverDate VARCHAR(255),
    FOREIGN KEY (request_id) REFERENCES request(id),
    PRIMARY KEY (id)
  )`;
  connection.query(sql, (err) => {
    if (err) throw err;
    console.log("Responses table checked/created!");
  });
};

export const insertResponse = (responseData, callback) => {
  connection.query('INSERT INTO responses SET ?', responseData, callback);
};

createTableIfNotExists();
