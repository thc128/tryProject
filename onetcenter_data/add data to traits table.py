import psycopg2 as pg
import json

connection_pg=None
pg_cursor=None
with open(r'jsonformatter.json','r') as data:
    dic_of_jobs = json.loads(data.read())
with open(r'codebeautify.json','r') as name_of_job:
    code_to_name = json.loads(name_of_job.read())
try:
    connection_pg=pg.connect(database="Testing_DB",user="ddanan",password="DH204KY1!",host="rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com",port="5432")
    pg_cursor=connection_pg.cursor()
except Exception as e:
    print e.message
for key, value in dic_of_jobs.iteritems():
    refined_job_name=code_to_name[key].replace('\'','\"')
    one_name="\'"+refined_job_name+"\'"
    query="INSERT INTO traits (job_name,onet) VALUES("+one_name+",1)"
    try:
        pg_cursor.execute(query)
    except Exception as e:
        print e.message
    print str
try:
    connection_pg.commit()
except Exception as e:
    print e.message
print 'looks good!'
try:
    connection_pg.close()
except Exception as e:
    print e.message