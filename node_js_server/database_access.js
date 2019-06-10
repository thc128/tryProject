var traitNames=['Openness','Consciousness','Extaversion','Agreeableness','Neuroticism','Secure','Anxious_preoccupied','Fearfull_Avoidant','Dissmising_Avoidant','Soical_Desirability','Creativity','Locus_of_control','Self_efficacy','Risk_taking','istress_Tolerance','Distress_Appraisal','Distress_Absorbsion','Distress_Regulation','Distress_Tolerance','Tolerance_for_Ambiguity','Ambiguous_stimuli','Complex_stimuli','Uncertain_stimuli','New_stimuli','Insoluble_stimuli','Emotional_Intelligence','Self_emotion_appraisal','Others_emotion_appraisal','Use_of_emotion','Regulation_of_emotion','Improvisation__Total_score','Improvisation_creativity_and_bricolage','Improvisasion_function_under_pressure___stress','Improvisation_spontaneity_and_persistence','Self_dicipline','The_Short_Dark_Triad','SImprovisasion_function_under_pressure___stress','Narcissism_related_tendencies','Psychopathy_related_tendencies'];
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
		await pgclient.query("INSERT INTO jobs_catalog_table (job_name,jobs_catalog_id,Job_Category_name,Job_Category_id, organizational_units_information_id/*,onet*/) VALUES ($1,$2,$3,$4,$5/*,False*/);",[roleName,roleID,categoryName,categoryID,roleID])
		.then(async res => {result=res.command;})
		.catch(async e => {result=e.stack;})		
		return result;
	},
	pushOtherColumns: async function(pgclient,values,roleID)
	{
		var queryString="UPDATE jobs_catalog_table SET Job_Description = $1  , notes = $2 , Gender_Preference = $3 , Age_Preferences = $4 , date_entered = $5 WHERE jobs_catalog_id = $6;"
		values.forEach(assume);
		if (values[4]=='')
			values[4]=null;
		var queryValues=values.concat([roleID]);
		var result=null;
		await pgclient.query(queryString,queryValues)
		.then(async res => {result=res.command;})
		.catch(async e => {result=e.stack;})
		return result;
	},
	pushToOrganizationTable: async function(pgclient,values,organizationID,organizationalInfoID)
	{
		var updateQueryString="UPDATE organizational_units_information_table SET recruiting_entity = $1 ,Job_Department = $2,organization_id=$3 WHERE organizational_units_information_id = $4";
		var insertQueryString="INSERT INTO organizational_units_information_table (recruiting_entity, Job_Department,organization_id, organizational_units_information_id) VALUES($1,$2,$3,$4);";
		values.forEach(assume);
		var queryValues=values.concat([organizationID]).concat([organizationalInfoID]);
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
	pushData: async function(pgclient,traitName,traitsValues,jobID)
	{
		var updateQueryString="UPDATE trait_range_per_job SET trait_low = $1, trait_below_average = $2,trait_average = $3,trait_above_average = $4, trait_high = $5, trait_range_per_job_id=$6 WHERE jobs_catalog_id = $7 AND trait_name= $8;"
		var insertQueryString="INSERT INTO trait_range_per_job (trait_low, trait_below_average, trait_average, trait_above_average ,trait_high, trait_range_per_job_id, jobs_catalog_id, trait_name) VALUES($1,$2,$3,$4,$5,$6,$7,$8);";
		var categoryNum=jobID.split('-')[0].split('C')[1];
		var roleNum=jobID.split('-')[1];
		var traitNum=traitNames.indexOf(traitName)
		var traitID=categoryNum*10000000+roleNum*100000+traitNum;
		var queryValues=[traitsValues[0],traitsValues[1],traitsValues[2],traitsValues[3],traitsValues[4],traitID,jobID,traitName];
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
		var result3=null;
		await client.query("SELECT * FROM jobs_catalog_table WHERE jobs_catalog_id=$1;",[currentRole])
		.then(async res => {result1=res.rows;})
		.catch(async e => {result1=e.stack;})
		await client.query("SELECT * FROM organizational_units_information_table WHERE organizational_units_information_id=$1;",[currentRole])
		.then(async res => {result2=res.rows;})
		.catch(async e => {result2=e.stack;})
		await client.query("SELECT * FROM trait_range_per_job WHERE jobs_catalog_id=$1;",[currentRole])
		.then(async res => {result3=res.rows;})
		.catch(async e => {result3=e.stack;})	
		return result1.concat(result2).concat(result3);
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