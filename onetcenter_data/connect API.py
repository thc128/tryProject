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
            trait=item[2]
            data_value=item[4]
            if not job_id in dict:
                dict[job_id]={}
            dict[job_id][trait]=data_value
        except Exception as e:
            print(e.message)
    return dict

def data_mining(base_url, name):
    my_link = base_url + name + '.txt'
    r = get_data(my_link)
    data = parse_data(r.text)
    return data


base_url = r'https://www.onetcenter.org/dl_files/database/db_23_0_text/'
table_names=['Abilities','Interests','Work%20Values','Work%20Styles']
serialized_data={}
for name in table_names:
    data = data_mining(base_url,name)
    serialized_data=get_data_values(data,serialized_data)
with open(r'output.txt','w+') as data:
    data.write(str(serialized_data))
print serialized_data
'''
with open(r'traits from Onet.txt',"r") as traits_pool:
    trait_list=traits_pool.readlines()
print trait_list
'''