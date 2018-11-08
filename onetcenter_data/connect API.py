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
        except:
            pass
    element_names=list(set(element_names))
    return element_names

def data_mining(base_url, name):
    my_link = base_url + name + '.txt'
    r = get_data(my_link)
    data = parse_data(r.text)
    return get_elements(data)


base_url = r'https://www.onetcenter.org/dl_files/database/db_23_0_text/'
table_name=['Abilities','Interests','Work%20Values','Work%20Styles']



