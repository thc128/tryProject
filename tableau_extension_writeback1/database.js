
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
	pgclient.query(queryString, (err, res) => {
	console.log("Errors: ",err)
	console.log("Command: ", res.command)
	console.log("Rows: ", res.rows)
	client.end()
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

function insertOneTrait(pgclient,roleName,traitName,s1val,s2val,s3val,s4val,s5val)
{
	myQuery="INSERT INTO "+roleName+" (trait,stage1,stage2,stage3,stage4,stage5) VALUES ("+traitName+","+s1val+","+s2val+","+s3val+","+s4val+","+s5val+");";
    runQuery(pgclient,myQuery)
}



var pg = require('pg');
var client = initClient(pg)
client.connect();
askTable(client,"asaf2");
updateTable(client,"asaf2");
console.log("OK 1");
createNewRole(client,"asaf8");
insertOneTrait(client,"asaf8",3,6,7,8,2);
askTable(client,"asaf8");
console.log("OK 2");