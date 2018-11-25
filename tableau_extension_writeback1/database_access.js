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
	
	getFromOnetTable:async function(pgclient,roleName)
	{
		var result;
		await pgclient.query("SELECT * FROM ONet_traits WHERE job_name='"+roleName+"';",(err, res) => {
			result= res.rows[0];
			});
		return result;		
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

