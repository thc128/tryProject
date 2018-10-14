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
app.use(express.static(path.join(__dirname, '/views')));

app.get('/', function(req, res) {
  res.render('index.ejs');
});


app.post('/addData', async function(req, res){
  res.redirect('/addData');
  console.log('POST request made');
  console.log(req.body);
  console.log(req.body.myRole);
  var currentRole=req.body.myRole;
  myData=JSON.parse(req.body.traits);
  //console.log(myData.Tolerance);
  var pg = require('pg');
  var client =new pg.Client({
  	user: 'ddanan',
  	host: 'rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com',
  	database: 'Testing_DB',
  	password: 'DH204KY1!',
  	port: 5432
  })
  client.connect();
  var exist = false;
  await client.query("SELECT * FROM traits WHERE Job_Name='"+currentRole+"';", async(err, res) => {
  	console.log("Errors: ",err)
  	console.log("Command: ", res.command)
  	console.log("Rows: ", res.rows)
	console.log("Job: ", res.rows[0].job_name)
	console.log("length: ", res.rows.length)
	if (res.rows.length >0)
	{
		exist=true;
	}
  })
  var x
  for (x in myData)
  {
	console.log(x);
	console.log(eval('myData.'+x));
    x_array=eval('myData.'+x);//using eval. Is it Good??????????
	
	if (exist)
	{
		myQuery="UPDATE traits SET "+x+"_Low = "+x_array[0]+","+x+"_Below_Average= "+x_array[1]+","+x+"_Average= "+x_array[2]+","+x+"_Above_Average="+x_array[3]+","+x+"_High="+x_array[4]+" WHERE Job_Name = '"+currentRole+"';"
	}
	else 
	{ 
	myQuery="INSERT INTO traits (Job_Name,"+x+"_Low,"+x+"_Below_Average,"+x+"_Average,"+x+"_Above_Average,"+x+"_High) VALUES (\
  	'"+currentRole+"'\
	,"+x_array[0]+"\
  	,"+x_array[1]+"\
  	,"+x_array[2]+"\
  	,"+x_array[3]+"\
  	,"+x_array[4]+");";
	}	
	console.log(myQuery);
    client.query(myQuery, (err, res) => {
		console.log("Errors: ",err)
		console.log("Command: ", res.command)
		console.log("Rows: ", res.rows)
		client.end()
	})

  }
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
