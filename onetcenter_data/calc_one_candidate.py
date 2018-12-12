import psycopg2 as pg
import numpy as np

weights=[0.2,0.2,0.2,0.2,0.2]
ideal_score=[5,5,5,5,1]

connection_pg = pg.connect(database="Testing_DB", user="ddanan", password="DH204KY1!",host="rds-postgresql-10mintutorial.cwmieimhe1v4.us-east-2.rds.amazonaws.com", port="5432")
pg_cursor = connection_pg.cursor()

def candidate_data(candidate_name):
    query="select candidate_name,openness,consciousness,extaversion,agreeableness,neuroticism from candidates where candidate_name='"+candidate_name+"';"
    print query
    pg_cursor.execute(query)
    result = pg_cursor.fetchall()
    connection_pg.close()

    return result

def calc(result,weight,ideali_score):
    scores = result[1:]
    gap = list(np.subtract(ideali_score, scores))
    grade = np.dot(weight, gap)
    variance = np.var(gap)
    final_grade = grade * variance
    OCEAN_grade = [grade, variance, final_grade]
    return OCEAN_grade

def push_data(result):
    query="insert into candidates_grades values('{0}',{1},{2},{3},{4},{5},{6},{7},{8},{9});".format(*result)
    print query

result=candidate_data('Asi')
result=list(result[0])
a=calc(result,weights,ideal_score)
result+=a
print result
push_data(result)


