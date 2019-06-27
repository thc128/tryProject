import ast

traits_dictionary={}
trait_template=''
with open('traits_dictionary.txt','r') as traits_dict:
    traits_data=traits_dict.read()
    traits_dictionary=ast.literal_eval(traits_data)

with open('trait_template.txt','r') as template:
    trait_template=template.read()

new_traits_object=''
for trait in traits_dictionary:
    temp_object=trait_template.replace('[trait_name]',trait)
    temp_object=temp_object.replace('[trait_description]',traits_dictionary[trait])
    new_traits_object+=temp_object
with open('traits_object_output.txt','w+') as output:
    output.write(new_traits_object)
