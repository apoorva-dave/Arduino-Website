var express = require('express');
var router = express.Router();
var con = require('../db');
var socketsAPI = require('../socket-api.js');

function getData(callback) {
  var sql = "SELECT * FROM framestestnew order by id DESC limit 50";
	con.query(sql, (err, results) => {
    if (err) throw err;
    console.log("got the results");
    callback(false, results)
  });
}

function saveFrameData(frameD, callback) {
  var sql = "INSERT INTO framestestnew(frameD) VALUES ('"+frameD+"')";
  // console.log(sql);
  con.query(sql, (err, results) => {
    if (err) throw err;
    console.log("Inserted into Database!");
    var data = {
    	id: results.insertId,
    	frameD: frameD
    }
    socketsAPI.sendNotification(data);
    callback(false, results)
  });
}

function getFrameData(callback) {
  var sql = "SELECT * FROM framestestnew where read_flag = 0 order by id DESC LIMIT 1";
  // console.log(sql);
  con.query(sql, (err, results) => {
    if (results.length > 0) {
			var rowId = results[0].id;
	  	var sql2 = "UPDATE framestestnew set read_flag = 1 where id <="+ rowId;
	  	// console.log(sql2);

	  	// Updating the read flag = 1
	  	con.query(sql2, (err, results) => {
		    if (err) throw err;
	  		console.log("Updated the read flag");
	  	});
	    callback(false, results)
    }else{
	    callback(true, null)
    }
  });
}

router.get('/all-data', function(req, res, next) {
	getData(function(err, results) {
  	if(err) throw err;
		  res.json({results: results});	    	
	  });	
});

router.get('/', function(req, res, next) {
  console.log("Inside Home Page!");
  getData(function(err, results) {
  	if(err) throw err;
  	console.log("inside the callback");
  	// console.log(results);
	  res.render('index', { title: 'Piksi'});	    	
  });
});

router.get('/add-frame', function(req, res, next) {
	// console.log("Inside add-frame");
	// var frameD = req.query.frameD;
	var frameD = req.query.frameD;
	saveFrameData(frameD, function(err, results){
		if (err) throw err;
		// console.log("Inside callback!")
		res.json({
			success: true
		});
	})
});
router.post('/post-add-frame', function(req, res, next) {
	// console.log("Inside add-frame");
	// var frameD = req.query.frameD;
	var frameD = req.body.frameD;
	saveFrameData(frameD, function(err, results){
		if (err) throw err;
		// console.log("Inside callback!")
		res.json({
			success: true
		});
	})
});
router.get('/get-frame', function(req, res, next) {
	// console.log("Inside get-frame");
	getFrameData(function(err, results){
		if (err) {
			console.log(err)
			res.send(null);
		}
		// console.log("Inside callback!");
		// res.send(results[0].frameD.replace(/,/g,''));
		else{
			res.send(results[0].frameD);
		}
	})
});

router.get('/thesis', function(req, res, next) {
  console.log("Inside Thesis Page!");
  res.render('thesis', { title: 'Piksi'});
});

router.get('/graph', function(req, res, next) {
  getData(function(err, results) {
  	if(err) throw err;
  	console.log("inside the callback");
  	// console.log(results);
	res.render('graph', { title: 'Piksi', tableData: results});	    	
  });
});
module.exports = router;