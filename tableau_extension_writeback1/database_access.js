//functions to open/close sessions front of server. OCP
module.exports =
{
	openSession: function(pgModule)
	{
		var client =new pgModule.Client({
			user: 'ddanan',
			host: 'rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com',
			database: 'Testing_DB',
			password: 'DH204KY1!',
			port: 5432
		})
		client.connect();
		return client;
	},

	closeSession: function(client)
	{
		client.end();
	},
	
	pushData: function(pgclient,queryString)
	{
		pgclient.query(queryString, (err, res) => {
		console.log("Errors: ",err)
		console.log("Command: ", res.command)
		console.log("Rows: ", res.rows)
		this.closeSession(pgclient);
	})
	}
	
	
}
/*
getRole :function(pgclient,role)
	{
		myQuery="SELECT * FROM traits WHERE job_name='"+role+"';";
		return pgclient.query(myQuery, (err, res) => {
		console.log("Errors: ",err)
		console.log("Command: ", res.command)
		console.log("Rows: ", res.rows)
		})
	}
	*/
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
	runQuery(pgclient,myQuery)
}

function updateTable(pgclient,tableName)
{
	myQuery="UPDATE " + tableName + " SET column2=4846 WHERE column1='asaf'"
	runQuery(pgclient,myQuery)
}

function createNewRole(pgclient,roleName,myTraits)
{
	myQuery="CREATE TABLE \
	" + roleName + "\
	(	trait char(100),\
    stage1 int,\
	stage2 int,\
    stage3 int,\
	stage4 int,\
	stage5 int);";
	runQuery(pgclient,myQuery)
	for (i=0;i<myTraits.length;i++)
		insertOneTrait(pgclient,roleName,myTraits[i])
}


function insertOneTrait(pgclient,roleName,myTrait)
{
//	myQuery="INSERT INTO "+roleName+" (trait,stage1,stage2,stage3,stage4,stage5) VALUES ("+traitName+","+s1val+","+s2val+","+s3val+","+s4val+","+s5val+");";
	myQuery="INSERT INTO "+roleName+" VALUES (\
	"+myTrait[0]+"\
	,"+String(myTrait[1])+"\
	,"+String(myTrait[2])+"\
	,"+String(myTrait[3])+"\
	,"+String(myTrait[4])+"\
	,"+String(myTrait[5])+");";
    runQuery(pgclient,myQuery)
}


/*
var pg = require('pg');
var client = initClient(pg)
client.connect();
var traits=[["'boie'",1,5,3,4,9],["'shamen'",5,8,4,1,9],["'gavoah'",7,9,4,2,6],["'ayef'",8,9,6,1,6]];
var tableName="asaf11";
createNewRole(client,tableName,traits);
askTable(client,tableName);
*/


//insertOneTrait(client,"asaf9",myTrait);
//client.end()