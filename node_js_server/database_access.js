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
	
	addNewRole: async function(pgclient,roleName,roleID,categoryName,categoryID)
	{
		var result=null;
		await pgclient.query("INSERT INTO jobs_catalog_table (job_name,jobs_catalog_id,Job_Category_name,Job_Category_id/*,onet*/) VALUES ($1,$2,$3,$4/*,False*/);",[roleName,roleID,categoryName,categoryID])
		.then(async res => {result=res.command;})
		.catch(async e => {result=e.stack;})		
		return result;
	},
	pushOtherColumns: async function(pgclient,values,roleID)
	{
		var queryString="UPDATE jobs_catalog_table SET Job_Description = $1 /*, Job_Category = $2 , Reqruting_entity = $4 ,Job_Department = $5*/ , notes = $2 , Gender_Preference = $3 , Age_Preferences = $4 , date_entered = $5 WHERE jobs_catalog_id = $6;"
		values.forEach(assume);
		var queryValues=values.concat([roleID]);
		var result=null;
		await pgclient.query(queryString,queryValues)
		.then(async res => {result=res.command;})
		.catch(async e => {result=e.stack;})
		return result;
	},
	
	pushData: async function(pgclient,traitName,traitsValues,jobID)
	{
		var updateQueryString="UPDATE trait_range_per_job SET trait_low = $1, trait_below_average = $2,trait_average = $3,trait_above_average = $4, trait_high = $5 WHERE jobs_catalog_id = $6 AND trait_name= $7;"
		var insertQueryString="INSERT INTO trait_range_per_job (trait_low, trait_below_average, trait_average, trait_above_average ,trait_high, jobs_catalog_id, trait_name) VALUES($1,$2,$3,$4,$5,$6,$7);";
		var queryValues=[traitsValues[0],traitsValues[1],traitsValues[2],traitsValues[3],traitsValues[4],jobID,traitName];
		queryValues.forEach(assumeNum);
		var result=null;
		var count=null;
		await pgclient.query(updateQueryString,queryValues)
		.then(async res => {result=res.command;count=res.rowCount;})
		.catch(async e => {result=e.stack;})
		if(count==0)
		{
			await pgclient.query(insertQueryString,queryValues)
			.then(async res => {result=res.command;})
			.catch(async e => {result=e.stack;})
		}
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
	
	jobsData: async function(client)
	{
		myQuery="SELECT jobs_catalog_id,job_name,job_category_name,job_category_id FROM jobs_catalog_table;";
		var data={}
		console.log(myQuery);
		await client.query(myQuery)
		.then( async res => 
		{
		    for (i=0;i<res.rows.length;i++)
			{
				jobName=res.rows[i]['job_name'];
				jobID=res.rows[i]['jobs_catalog_id'];
				categoryID=res.rows[i]['job_category_id'];
				categoryName=res.rows[i]['job_category_name'].trim();
				if (data[categoryName]==null)
					data[categoryName]={'ID':'','Jobs':{}};
				data[categoryName]['ID']=categoryID;
				data[categoryName]['Jobs'][jobName]={'ID':jobID};
			}
		}	)
		.catch(async e => {data=e.stack;})
		return data;
	},
	
	getRoleData:async function(client,currentRole)
	{
		var result1=null;
		var result2=null;
		await client.query("SELECT * FROM jobs_catalog_table WHERE jobs_catalog_id=$1;",[currentRole])
		.then(async res => {result1=res.rows;})
		.catch(async e => {result1=e.stack;})
		await client.query("SELECT * FROM trait_range_per_job WHERE jobs_catalog_id=$1;",[currentRole])
		.then(async res => {result2=res.rows;})
		.catch(async e => {result2=e.stack;})	
		return result1.concat(result2);
	}
	
	
}

function assumeNum(value,index,arr)
{	
	if (value==undefined||value==null )
		arr[index]=0;
}

function assume(value,index,arr)
{	
	if (value==undefined)
		arr[index]=null;
}