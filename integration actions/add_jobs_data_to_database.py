import psycopg2 as pg
import json

connection_pg=None
pg_cursor=None
with open(r'jobs_data.json','r') as data:
    dic_of_jobs = json.loads(data.read())

try:
    connection_pg=pg.connect(database="Testing_DB",user="ddanan",password="DH204KY1!",host="rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com",port="5432")
    pg_cursor=connection_pg.cursor()
except Exception as e:
    print e.message
for key, value in dic_of_jobs.iteritems():
    one_row = value.values()
    refined_job_name=code_to_name[key].replace('\'','\"')
    one_row.insert(0, "\'"+refined_job_name+"\'")
    str = ','.join(one_row)
    query="INSERT INTO ONet_traits Values("+str+")"
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