import connection from './db.js';

const createTableIfNotExists = () => {
  const sql = `CREATE TABLE IF NOT EXISTS request (
    id int NOT NULL AUTO_INCREMENT,
    shareId BIGINT,
    url VARCHAR(255),
    method VARCHAR(50),
    pathUrl VARCHAR(255),
    scheme VARCHAR(50),
    domain VARCHAR(255),
    PRIMARY KEY (id)
  )`;
  connection.query(sql, (err) => {
    if (err) throw err;
    console.log("Request table checked/created!");
  });
};

export const insertRequest = (requestData, callback) => {
  connection.query('INSERT INTO request SET ?', requestData, callback);
};


export const getRequestByShareId = (shareId, callback) => {
  connection.query('SELECT * FROM request  join  responses on request.id=responses.request_id  WHERE request.shareId = ?', shareId, callback);
}; 



createTableIfNotExists();
