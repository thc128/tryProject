import psycopg2 as pg
import json

dic_of_jobs={}
code_to_name={}
with open(r'jsonformatter.json','r') as data:
    dic_of_jobs = json.loads(data.read())
with open(r'codebeautify.json','r') as name_of_job:
    code_to_name = json.loads(name_of_job.read())

connection_pg=pg.connect(database="Testing_DB",user="ddanan",password="DH204KY1!",host="rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com",port="5432")
pg_cursor=connection_pg.cursor()
for key, value in dic_of_jobs.iteritems():
    one_row = value.values()
    refined_job_name=code_to_name[key].replace('\'','\"')
    one_row.insert(0, "\'"+refined_job_name+"\'")
    str = ','.join(one_row)
    query="INSERT INTO ONet_traits Values("+str+")"
    pg_cursor.execute(query)

    print str
connection_pg.commit()
print 'looks good!'
connection_pg.close()
