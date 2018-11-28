
with open (r"..\..\traits list.txt","r") as traits:
    all_traits=traits.read()
all_traits=all_traits.split("\n")#convert to list

with open(r"template.txt","r") as temp:
    my_temp=temp.read()

output_temp=open ("output.txt","w+")
for trait in all_traits:
    current=my_temp.replace("Openness",trait)
    output_temp.write(current)
output_temp.close()