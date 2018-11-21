import psycopg2 as pg
import numpy as np


values=[0.2,0.2,0.2,0.2,0.2]
connection_pg = pg.connect(database="Testing_DB", user="ddanan", password="DH204KY1!",host="rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com", port="5432")
pg_cursor = connection_pg.cursor()
query = "select candidate_name,openness,consciousness,extaversion,agreeableness,neuroticism from candidates"
pg_cursor.execute(query)
result=pg_cursor.fetchall()
connection_pg.close()
OCEAN_grade={}
for item in result:
    scores=item[1:]
    #avg=np.multiply(values, scores)
    #sum_of_items=sum(avg)
    #print avg
    #print sum_of_items
    #print '========================'
    OCEAN_grade[item[0].replace(' ','')]=np.dot(values,scores)
    print sorted(OCEAN_grade,key=OCEAN_grade.__getitem__,reverse=True)
for item in OCEAN_grade.items():
    print item

    #   print item[0]
  #  scoring =
#print result
