var express = require('express');
var fs = require('fs');
var path = require('path')
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var products = [];

app.use("/public", express.static(__dirname + "/public"));
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
  res.render('index.ejs');
});


app.post('/addData', function(req, res){
  res.redirect('/addData');
  console.log('POST request made');
  console.log(req.body);
  myData=JSON.parse(req.body.traits);
  //console.log(myData.Tolerance);
  var x
  for (x in myData)
  {
	console.log(x);
	console.log(eval('myData.'+x));
    x_array=eval('myData.'+x);//using eval. Is it Good??????????
    var pg = require('pg');
    var client =new pg.Client({
  		user: 'ddanan',
  		host: 'rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com',
  		database: 'Testing_DB',
  		password: 'DH204KY1!',
  		port: 5432
  	})
    client.connect();
    myQuery="INSERT INTO traits ("+x+"_Low,"+x+"_Below_Average,"+x+"_Average,"+x+"_Above_Average,"+x+"_High) VALUES (\
  	"+x_array[0]+"\
  	,"+x_array[1]+"\
  	,"+x_array[2]+"\
  	,"+x_array[3]+"\
  	,"+x_array[4]+");";
  	console.log(myQuery);
      client.query(myQuery, (err, res) => {
  	console.log("Errors: ",err)
  	console.log("Command: ", res.command)
  	console.log("Rows: ", res.rows)
  	client.end()
  })}
});

app.get('/addData', function(req, res){
   res.render('data1.html', {products: products});
   console.log('GET request made');
 });
 
 app.get('/addData', function(req, res){
   res.render('testCSS.css', {products: products});
   console.log('GET request made');
 });
 
 
app.listen(3000, function(){
  console.log('Server is running on localhost:3000');
});
