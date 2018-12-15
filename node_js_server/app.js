//imports
var express = require('express');
var fs = require('fs');
var path = require('path')
var bodyParser = require('body-parser');
var pg = require('pg');
var db=require('./database_access');
var app = express();
/*var UPDATE_TEMPLATE="UPDATE traits SET \
			[trait]_Low = [0],\
			[trait]_Below_Average= [1],\
			[trait]_Average= [2],\
			[trait]_Above_Average=[3],\
			[trait]_High=[4]\
			WHERE Job_Name = '[currentRole]';"
*/

//Engine images and files
app.use(bodyParser.urlencoded({extended: true}));
app.use("/public", express.static(__dirname + "/public"));
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/views')));

//The first page, present text from index.ejs 
app.get('/', function(req, res) {
  res.render('index.ejs');
});


//import the page thus user request
app.get('/addData', async function(req, res){
	var client =db.openSession(pg);
	var myData=[]
	myData=myData.concat(await db.job_name(client,"traits"));
	//console.log("Jobs:",myData);
	res.render('data1.html', {products: myData});
	console.log('GET request with params made');
	db.closeSession(client);
});
	


//
app.post('/addData', async function(req, res){
	res.redirect('/addData');
	console.log('POST request made');
	console.log(req.body);
	console.log(req.body.myRole);
	var currentRole=req.body.myRole;
	myData=JSON.parse(req.body.traits);  
	
	var client=db.openSession(pg);
	var exist = await db.verifyExistance(client,currentRole);
	var oneTrait
	for (oneTrait in myData)
	{
		console.log(oneTrait);
		console.log(myData[oneTrait]);
		traitsValues=myData[oneTrait];
		var myValues=[];
		if (exist)
		{
			myQuery="UPDATE traits SET [trait]_Low = $1, [trait]_Below_Average = $2,[trait]_Average = $3,[trait]_Above_Average = $4, [trait]_High = $5 WHERE Job_Name = $6;"
			myQuery=myQuery.replace(/\[trait\]/g,oneTrait);
			myValues=[traitsValues[0],traitsValues[1],traitsValues[2],traitsValues[3],traitsValues[4],currentRole];
			myValues.forEach(assume);
			console.log(myValues);
		}
		else 
		{ 
		myQuery="INSERT INTO traits (Job_Name,"+oneTrait+"_Low,"+oneTrait+"_Below_Average,"+oneTrait+"_Average,"+oneTrait+"_Above_Average,"+oneTrait+"_High,onet) VALUES (\
		'"+currentRole+"'\
		,"+traitsValues[0]+"\
		,"+traitsValues[1]+"\
		,"+traitsValues[2]+"\
		,"+traitsValues[3]+"\
		,"+traitsValues[4]+"\
		,False);";
		exist=true;
		}	
		console.log(myQuery);
		console.log(myValues);
		await pushhh(client,myQuery,myValues);
	}
	db.closeSession(client);
});


app.post('/roleData',async function(req, res){
	console.log("Role DATA");
	console.log(req.body);
	console.log('POST request made');
	var client = db.openSession(pg)
	var myRole=req.body.role.slice(1,-1);
	myQuery="SELECT * FROM traits WHERE job_name='"+myRole+"';";
	console.log(myQuery);
	client.query(myQuery,async (err, res2) => {
		var myData=res2.rows;
		queryLog(err,res2,{"Data":myData});
		if(res2.rows[0].onet)
		{
			onetData=await db.getFromOnetTable(client,myRole);
			console.log(onetData);
		}
		else
		{
			onetData=null;
		}
		res.send({data:myData,OnetData:onetData});

		db.closeSession(client);
	})
  
 }); 
 

app.listen(3000, function(){
  console.log('Server is running on localhost:3000');
});

//print to Console
function queryLog(err,res)
{
	console.log("Errors: ",err)
  	console.log("Command: ", res.command)
  	console.log("Rows: ", res.rows)
	if (arguments.length>2)
	{
		for (i=2;i<arguments.length;i++)
		{
			console.log(arguments[i]);
		}
	}
}

function assume(value,index,arr)
{	
	if (value==undefined||value==null)
		arr[index]=0;
}

async function pushhh(pgclient,queryString,queryValues)
	{
		await pgclient.query(queryString,queryValues)
		.then(async res => {
		console.log(res.rows[0])
		})
		.catch(async e => console.error(e.stack))
		
	}