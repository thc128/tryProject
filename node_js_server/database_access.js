//functions to open/close sessions front of server. OCP
module.exports =
{
	openSession: function(pgModule)
	{
		var client =new pgModule.Client({
			user: 'postgres',
			host: 'localhost',
			database: 'postgres',
			password: 'Elichoref13',
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
		await pgclient.query("SELECT * FROM ONet_traits WHERE job_name=$1;",[roleName])
		.then(async res => 
		{
			result= res.rows[0];
		})
		.catch(async e => {result=e.stack;})
		return result;		
	},
	
	pushData: async function(pgclient,queryString,queryValues)
	{
		var result=null;
		await pgclient.query(queryString,queryValues)
		.then(async res => {result=res.command;})
		.catch(async e => {result=e.stack;})
		return result;
	
	},
	//query function
	job_name:async function (client)
	{
		myQuery="SELECT job_name FROM traits;";
		var data=[]
		console.log(myQuery);
		await client.query(myQuery)
		.then( async res => 
		{
			for (i=0;i<res.rows.length;i++)
			{
				data.push(res.rows[i].job_name)
			}
		}	)
		.catch(async e => {data.push(e.stack);})
		return data;
	},
	
	getRoleData:async function(client,currentRole)
	{
		var result=null;
		await client.query("SELECT * FROM traits WHERE Job_Name=$1;",[currentRole])
		.then(async res => {result=res.rows;})
		.catch(async e => {result=e.stack;})		
		return result;
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

