//imports
var express = require('express');
var fs = require('fs');
var path = require('path')
var bodyParser = require('body-parser');
var pg = require('pg');
var db=require('./database_access');
var app = express();
var traitNames=['Openness','Consciousness','Extaversion','Agreeableness','Neuroticism','Secure','Anxious_preoccupied','Fearfull_Avoidant','Dissmising_Avoidant','Soical_Desirability','Creativity','Locus_of_control','Self_efficacy','Risk_taking','istress_Tolerance','Distress_Appraisal','Distress_Absorbsion','Distress_Regulation','Distress_Tolerance','Tolerance_for_Ambiguity','Ambiguous_stimuli','Complex_stimuli','Uncertain_stimuli','New_stimuli','Insoluble_stimuli','Emotional_Intelligence','Self_emotion_appraisal','Others_emotion_appraisal','Use_of_emotion','Regulation_of_emotion','Improvisation__Total_score','Improvisation_creativity_and_bricolage','Improvisasion_function_under_pressure___stress','Improvisation_spontaneity_and_persistence','Self_dicipline','The_Short_Dark_Triad','SImprovisasion_function_under_pressure___stress','Narcissism_related_tendencies','Psychopathy_related_tendencies'];

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
	myData=myData.concat(await db.job_name(client));
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
	roleData=await db.getRoleData(client,currentRole);
	console.log(roleData.length>0);
	var exist = (roleData.length>0);
	var oneTrait;
		
	for (oneTrait in myData)
	{
		if (traitNames.indexOf(oneTrait)==-1)
		{
			console.log("Bad request, this trait is not valid:",oneTrait);
			break;
		}
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
		myQuery="INSERT INTO traits (Job_Name,[trait]_Low,[trait]_Below_Average,[trait]_Average,[trait]_Above_Average,[trait]_High,onet) \
		VALUES ($1,$2,$3,$4,$5,$6,False);";
		myQuery=myQuery.replace(/\[trait\]/g,oneTrait);
		myValues=[currentRole,traitsValues[0],traitsValues[1],traitsValues[2],traitsValues[3],traitsValues[4]];
		myValues.forEach(assume);
		exist=true;
		}	
		console.log(myQuery);
		console.log(myValues);
		result=await db.pushData(client,myQuery,myValues);
		console.log("returned:",result);
	}
	db.closeSession(client);
});


app.post('/roleData',async function(req, res){
	console.log("Role DATA");
	console.log(req.body);
	console.log('POST request made');
	var client = db.openSession(pg)
	var myRole=req.body.role.slice(1,-1);
	var myData= await db.getRoleData(client,myRole);
	console.log({"Data":myData});
	if(myData[0].onet)
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
	
  
 }); 
 

app.listen(3000, function(){
  console.log('Server is running on localhost:3000');
});


function assume(value,index,arr)
{	
	if (value==undefined||value==null)
		arr[index]=0;
}
