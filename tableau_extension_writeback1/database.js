
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

function askTable(pgclient,tableName)
{
	myQuery="SELECT * from "+tableName
	pgclient.query(myQuery, (err, res) => {
	console.log("Errors: ",err)
	console.log("Command: ", res.command)
	console.log("Rows: ", res.rows)
	client.end()
	})
}

function updateTable(pgclient,tableName)
{
	myQuery="UPDATE " + tableName + " SET column2=4846 WHERE column1='asaf'"
	pgclient.query(myQuery, (err, res) => {
	console.log("Errors: ",err)
	console.log("Command: ", res.command)
	console.log("Rows: ", res.rows)
	client.end()
	})
}

var pg = require('pg');
var client = initClient(pg)
client.connect();
askTable(client,"asaf2")
updateTable(client,"asaf2")