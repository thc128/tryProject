import requests
import sys
import warnings

if not sys.warnoptions:
    warnings.simplefilter("ignore")

def parse_data(data):
    lines=data.split('\r\n')
    after_parse=[]
    for line in lines:
        line = line.split('\t')
        after_parse.append(line)
    return after_parse

def get_data(data_path):
    return requests.get(data_path,verify=False)

def get_elements(data):
    element_names=[]
    for item in data:
        try:
            element_names.append(item[2])
        except Exception as e:
            print(e.message)
    element_names=list(set(element_names))
    return element_names

def get_data_values(data,dict):
    for item in data:
        try:
            job_id=item[0]
            job_id=job_id.replace('-','_').replace('.', '_')
            job_name=item[1]
            dict[job_id] = job_name
        except Exception as e:
            print(e.message)
    return dict

def data_mining(base_url, name):
    my_link = base_url + name + '.txt'
    r = get_data(my_link)
    data = parse_data(r.text)
    return data


base_url = r'https://www.onetcenter.org/dl_files/database/db_23_0_text/'
table_names=['Occupation%20Data']
serialized_data={}
for name in table_names:
    data = data_mining(base_url,name)
    serialized_data=get_data_values(data,serialized_data)
with open(r'output2.txt','w+') as data:
    data.write(str(serialized_data).replace('\'','\"').replace('u\"','\"'))
print serialized_data
'''
with open(r'traits from Onet.txt',"r") as traits_pool:
    trait_list=traits_pool.readlines()
print trait_list
'''