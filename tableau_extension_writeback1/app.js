var express = require('express');
var fs = require('fs');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var products = [];

app.use("/public", express.static(__dirname + "/public"));
app.engine('html', require('ejs').renderFile);


app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.post('/addData', function(req, res){
  console.log('POST request made');
  console.log(req.body);

  var selected = req.body.rad;
  res.redirect('/addData');
  var pg = require('pg');
  var client =new pg.Client({
		user: 'postgres',
		host: 'localhost',
		database: 'postgres',
		password: 'Elichoref13',
		port: 5432
	})
  client.connect();
  myQuery="INSERT INTO asaf11 VALUES (\
	'openness'\
	,"+String(selected)+"\
	,"+String(selected)+"\
	,"+String(selected)+"\
	,"+String(selected)+"\
	,"+String(selected)+");";
    client.query(myQuery, (err, res) => {
	console.log("Errors: ",err)
	console.log("Command: ", res.command)
	console.log("Rows: ", res.rows)
	client.end()
	})
});

app.get('/addData', function(req, res){
   res.render('data1.html', {products: products});
   console.log('GET request made');
 });
 
app.listen(3000, function(){
  console.log('Server is running on localhost:3000');
});
