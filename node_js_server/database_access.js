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
	
	addNewRole: async function(pgclient,roleName)
	{
		var result=null;
		await pgclient.query("INSERT INTO traits (Job_Name,onet) VALUES ($1,False);",[roleName])
		.then(async res => {result=res.command;})
		.catch(async e => {result=e.stack;})		
		return result;
	},
	
	pushData: async function(pgclient,traitName,traitsValues,currentRole)
	{
		var queryString="UPDATE traits SET [trait]_Low = $1, [trait]_Below_Average = $2,[trait]_Average = $3,[trait]_Above_Average = $4, [trait]_High = $5 WHERE Job_Name = $6;"
		queryString=queryString.replace(/\[trait\]/g,traitName);
		var queryValues=[traitsValues[0],traitsValues[1],traitsValues[2],traitsValues[3],traitsValues[4],currentRole];
		queryValues.forEach(assume);
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

function assume(value,index,arr)
{	
	if (value==undefined||value==null)
		arr[index]=0;
}