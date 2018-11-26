import psycopg2 as pg
import numpy as np


def grade_calculation(weight,ideali_score,candidates):
    OCEAN_grade = {}
    for item in candidates:
        scores = item[1:]
        name = item[0].replace(' ', '')
        gap = list(np.subtract(ideali_score, scores))
        grade = np.dot(weight, gap)
        variance = np.var(gap)
        final_grade = grade * variance
        OCEAN_grade[name] ={'gap':gap,'grade':grade,'variance':variance,'final_grade':final_grade}
    return OCEAN_grade

print 'working....'
team_size=2
weights=[0.2,0.2,0.2,0.2,0.2]
ideal_score=[5,5,5,5,1]
connection_pg = pg.connect(database="Testing_DB", user="ddanan", password="DH204KY1!",host="rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com", port="5432")
pg_cursor = connection_pg.cursor()
print 'running....'
query = "select candidate_name,openness,consciousness,extaversion,agreeableness,neuroticism from candidates"
pg_cursor.execute(query)
result=pg_cursor.fetchall()
print 'loading...'
connection_pg.close()
'''
OCEAN_grade={}

for item in result:
    scores=item[1:]
    gap=list(np.subtract(ideal_score,scores))
    #avg=np.multiply(values, scores)
    #sum_of_items=sum(avg)
    #print avg
    #print sum_of_items
    #print '========================'
    name=item[0].replace(' ','')
    grade=np.dot(weights,gap)
    variance=np.var(gap)
    OCEAN_grade[name]=grade*variance
'''
OCEAN_grade=grade_calculation(weights,ideal_score,result)
sorted_list = sorted(OCEAN_grade.iteritems(),key=lambda (k,v): (v['final_grade'],k))

print sorted_list
print sorted_list[:team_size]
for item in OCEAN_grade.items():
    print item

    #   print item[0]
  #  scoring =
#print result
