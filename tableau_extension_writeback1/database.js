
function initClient(postgresModule){
	var myClient=new postgresModule.Client({
		user: 'postgres',
		host: 'localhost',
		database: 'postgres',
		password: 'Elichoref13',
		port: 5432
	})
	return myClient
}

function runQuery(pgclient,queryString)
{
	//pgclient.connect();
	pgclient.query(queryString, (err, res) => {
	console.log("Errors: ",err)
	console.log("Command: ", res.command)
	console.log("Rows: ", res.rows)
	//pgclient.end()
	})
}
function askTable(pgclient,tableName)
{
	myQuery="SELECT * from "+tableName
	runQuery(pgclient,myQuery)
}

function updateTable(pgclient,tableName)
{
	myQuery="UPDATE " + tableName + " SET column2=4846 WHERE column1='asaf'"
	runQuery(pgclient,myQuery)
}

function createNewRole(pgclient,roleName)
{
	myQuery="CREATE TABLE " + roleName + " (	trait char(100),    stage1 int,	stage2 int,    stage3 int,	stage4 int,	stage5 int);";
	runQuery(pgclient,myQuery)
}

function insertOneTrait(pgclient,roleName,traitName,valArray)
{
//	myQuery="INSERT INTO "+roleName+" (trait,stage1,stage2,stage3,stage4,stage5) VALUES ("+traitName+","+s1val+","+s2val+","+s3val+","+s4val+","+s5val+");";
	myQuery="INSERT INTO "+roleName+" VALUES ("+traitName+","+String(valArray[0])+","+String(valArray[1])+","+String(valArray[2])+","+String(valArray[3])+","+String(valArray[4])+");";
    runQuery(pgclient,myQuery)
}



var pg = require('pg');
var client = initClient(pg)
client.connect();
askTable(client,"asaf2");
updateTable(client,"asaf2");
//createNewRole(client,"asaf8");
myvalues= new Array(1,4,8,3,9);
insertOneTrait(client,"asaf8","'bone'",myvalues);
askTable(client,"asaf8");
//client.end()