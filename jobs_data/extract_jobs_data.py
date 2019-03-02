import xlrd

FILEPATH='FINAL WITH CODES Occupations Categories and sub Categories January 14 2019 (1).xls'

def read_file(file_path):
	file_content =  xlrd.open_workbook(file_path)
	print(file_content.sheet_names())
	first_sheet = file_content.sheet_by_index(0)
	categories_data={}
	for row_id in range(first_sheet.nrows):
		print(first_sheet.row_values(row_id))
		if row_id==0:
			continue
		category_id=first_sheet.row_values(row_id)[0]
		category_name=first_sheet.row_values(row_id)[1]
		categories_data[category_id]=category_name
	print(categories_data)
	
	
read_file(FILEPATH)
	
