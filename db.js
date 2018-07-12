var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "thesis"
});

con.connect((err) => {
	  if (err) throw err;
});

module.exports = con;