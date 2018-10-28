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
  var x
  for (x in myData)
  {
	console.log(x);
	console.log(myData[x]);
    x_array=myData[x];
	
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
