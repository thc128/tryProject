import xlrd

FILE_PATH='FINAL WITH CODES Occupations Categories and sub Categories January 14 2019 (1).xls'
IGNORE_SHEETS=[0,55]
IGNORE_ROWS=[0]

def read_file(file_path):
	return  xlrd.open_workbook(file_path)
	
def create_categories_dict(my_workbook):
	categories_data={}
	first_sheet = my_workbook.sheet_by_index(0)
	for row_id in range(first_sheet.nrows):
		if row_id==0:
			continue
		category_id=translate_category_id(first_sheet.row_values(row_id)[0])
		category_name=first_sheet.row_values(row_id)[1]
		categories_data[category_id]={'name':category_name}
	return categories_data

def parse_file(my_workbook,categories_data):
	for sheet_id in range(my_workbook.nsheets):
		if sheet_id in IGNORE_SHEETS:
			continue
		print('sheet number: '+str(sheet_id))
		current_sheet=my_workbook.sheet_by_index(sheet_id)
		for row_id in range(current_sheet.nrows):
			if row_id in IGNORE_ROWS:
				continue
			print('row number: '+str(row_id))
			current_row=current_sheet.row_values(row_id)
			print(current_row)
			job_category_id=translate_category_id(current_row[0])
			job_id=translate_job_id(current_row[1])
			job_name=current_row[2]
			print(job_category_id,job_id,job_name)
			categories_data[job_category_id][job_id]=job_name
	return categories_data
	
def translate_category_id(id):
	return id[1:]
	
def translate_job_id(id):
	splitted=id.split('-')
	category_id=translate_category_id(splitted[0])
	job_id=splitted[1]
	final_id=str(int(category_id)*1000+int(job_id))
	return final_id


			

workbook=read_file(FILE_PATH)
all_jobs_data=create_categories_dict(workbook)
print(all_jobs_data)
all_jobs_data=parse_file(workbook,all_jobs_data)	
print(all_jobs_data)
with open('jobs_data.json','w+') as results:
	results.write(str(all_jobs_data))