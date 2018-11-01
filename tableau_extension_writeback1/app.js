var express = require('express');
var fs = require('fs');
var path = require('path')
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var products = ['asaf'];

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
	//console.log("Job: ", res.rows[0].job_name)
	console.log("length: ", res.rows.length)
	if (res.rows.length >0)
	{
		exist=true;
	}
  })
  var oneTrait
  for (oneTrait in myData)
  {
	console.log(oneTrait);
	console.log(myData[oneTrait]);
    traitsValues=myData[oneTrait];
	
	if (exist)
	{
		myQuery="UPDATE traits SET "+oneTrait+"_Low = "+traitsValues[0]+","+oneTrait+"_Below_Average= "+traitsValues[1]+","+oneTrait+"_Average= "+traitsValues[2]+","+oneTrait+"_Above_Average="+traitsValues[3]+","+oneTrait+"_High="+traitsValues[4]+" WHERE Job_Name = '"+currentRole+"';"
	}
	else 
	{ 
	myQuery="INSERT INTO traits (Job_Name,"+oneTrait+"_Low,"+oneTrait+"_Below_Average,"+oneTrait+"_Average,"+oneTrait+"_Above_Average,"+oneTrait+"_High) VALUES (\
  	'"+currentRole+"'\
	,"+traitsValues[0]+"\
  	,"+traitsValues[1]+"\
  	,"+traitsValues[2]+"\
  	,"+traitsValues[3]+"\
  	,"+traitsValues[4]+");";
	exist=true;
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
	/*if (Object.keys(req.query).length == 0){
		res.render('data1.html', {products: products});
		console.log('simple GET request made');
	}
	else{
		*/
		var pg = require('pg');
		var client =new pg.Client({
			user: 'ddanan',
			host: 'rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com',
			database: 'Testing_DB',
			password: 'DH204KY1!',
			port: 5432
		})
		client.connect();
		myQuery="SELECT job_name FROM traits";
		console.log(myQuery);
		  client.query(myQuery, (err, res2) => {
		console.log("Errors: ",err)
		console.log("Command: ", res2.command)
		console.log("Rows: ", res2.rows)
		var myData=[]
		for (i=0;i<res2.rows.length;i++)
		{
			console.log("Job name:",res2.rows[i].job_name);
			myData.push(res2.rows[i].job_name)
		}
		console.log("Jobs:",myData);
		res.render('data1.html', {products: myData});
		console.log('GET request with params made');
		client.end()
		  })
	
});
/* 
 app.get('/addData', function(req, res){
   res.render('testCSS.css', {products: products});
   console.log('GET request made');
 });
 */
 //import information from DataBase
 app.get('/xxx', function(req,res){
	 console.log("succesful");
 })

app.post('/roleData', function(req, res){
	console.log("Role DATA");
	console.log(req.body);
	var pg = require('pg');
		var client =new pg.Client({
			user: 'ddanan',
			host: 'rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com',
			database: 'Testing_DB',
			password: 'DH204KY1!',
			port: 5432
		})
		client.connect();
		myQuery="SELECT * FROM traits WHERE job_name='"+req.body.role.slice(1,-1)+"';";
		console.log(myQuery);
		  client.query(myQuery, (err, res2) => {
		console.log("Errors: ",err)
		console.log("Command: ", res2.command)
		console.log("Rows: ", res2.rows)
		var myData=res2.rows
		console.log("Data:",myData);
		res.send({data:myData});
		client.end()
		  })
   console.log(req.body);
   console.log('POST request made');
 }); 
 

app.listen(3000, function(){
  console.log('Server is running on localhost:3000');
});
