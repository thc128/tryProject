//imports
var express = require('express');
require('log-timestamp');
var fs = require('fs');
var path = require('path')
var bodyParser = require('body-parser');
var pg = require('pg');
var db=require('./database_access');
//initialize the app
var app = express();
//global variables
var otherColumnNames=['Job_Description','Notes','Gender_Preference','Age_Preferences','Date_Entered'];
var OrganizationTableColumnNames=['Recruiting_Entity','Job_Department'];
var traitNames=['Openness','Consciousness','Extaversion','Agreeableness','Neuroticism','Secure','Anxious_preoccupied','Fearfull_Avoidant','Dissmising_Avoidant','Soical_Desirability','Creativity','Locus_of_control','Self_efficacy','Risk_taking','istress_Tolerance','Distress_Appraisal','Distress_Absorbsion','Distress_Regulation','Distress_Tolerance','Tolerance_for_Ambiguity','Ambiguous_stimuli','Complex_stimuli','Uncertain_stimuli','New_stimuli','Insoluble_stimuli','Emotional_Intelligence','Self_emotion_appraisal','Others_emotion_appraisal','Use_of_emotion','Regulation_of_emotion','Improvisation__Total_score','Improvisation_creativity_and_bricolage','Improvisasion_function_under_pressure___stress','Improvisation_spontaneity_and_persistence','Self_dicipline','The_Short_Dark_Triad','SImprovisasion_function_under_pressure___stress','Narcissism_related_tendencies','Psychopathy_related_tendencies'];

//Engine images and files
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended: true}));
app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/views')));

//The first page, present text from index.ejs 
app.get('/', function(req, res) {
  res.render('index.ejs');
});


//import the page thus user request
app.get('/addData', async function(req, res){
	try
	{
	var client =db.openSession(pg);
	var myData=[];
	myData=await db.jobsData(client);
	console.log(myData);
	console.log(typeof myData);
	res.render('try2/tryToDoTraits.html', {categories: myData});
	console.log('GET request with params made');
	db.closeSession(client);
	}
	catch(error){
		console.log(error.message);
	}
});
	

//
app.post('/addData', async function(req, res){
	try
	{
	console.log('POST request made');
	console.log(req.body);
	console.log(req.body['Job_ID']);
	var currentRole=req.body['Job_ID'];
	var otherColumns=[];
	otherColumnNames.forEach(function(columnName){
		otherColumns.push(req.body[columnName])
		console.log(columnName);
		console.log(req.body[columnName]);
	});
	var organizationTableColumns=[];
	OrganizationTableColumnNames.forEach(function(columnName){
		organizationTableColumns.push(req.body[columnName])
		console.log(columnName);
		console.log(req.body[columnName]);
	});
	myData=JSON.parse(req.body.traits);  
	var client=db.openSession(pg);
	roleData=await db.getRoleData(client,currentRole);
	console.log(roleData);
	if (roleData.length<=0)
	{
		result=await db.addNewRole(client,currentRole);
		console.log("INSERT returned:",result);
	}
	result=await db.pushOtherColumns(client,otherColumns,currentRole);
	console.log("Other columns returned:",result);
	console.log(otherColumns);
	result=await db.pushToOrganizationTable(client,organizationTableColumns,0,currentRole);
	console.log("Organization table columns returned:",result);
	console.log(organizationTableColumns);
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
		result=await db.pushData(client,oneTrait,traitsValues,currentRole);
		console.log("returned:",result);
	}
	db.closeSession(client);
	res.redirect('/addData');
	}
	catch(error){
		console.log(error.message);
	}
});


app.post('/roleData',async function(req, res){
	try
	{
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
	}
	catch(error){
		console.log(error.message);
	}
 }); 
 

app.post('/addName',async function(req, res){
	try
	{
	console.log("New Name");
	console.log(req.body);
	console.log('POST request made');
	var client = db.openSession(pg)
	var myNewName=req.body.roleName.slice(1,-1);
	var myNewID=req.body.roleID;
	var categoryName=req.body.categoryName.slice(1,-1);
	var categoryID=req.body.categoryID;
	var answer=await db.addNewRole(client,myNewName,myNewID,categoryName,categoryID);
	console.log({"Answer":answer});
	var result=[];
	if(answer=="INSERT")
	{
		result=await db.jobsData(client);
	}
	else
	{
		result=["ERROR"];
	}
	res.send({result:result});
	db.closeSession(client);
	}
	catch(error){
		console.log(error.message);
	}
 });  
 
app.listen(80, function(){
	try
	{
		console.log('Server is running on localhost:80');
	}
	catch(error){
		console.log(error.message);
	}
});


