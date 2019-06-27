from bs4 import BeautifulSoup

SOURCE_FILE='Yoni\'s_page.html'
OUTPUT_FILE='traits_dictionary.txt'

traits_dictionary={}
with open(SOURCE_FILE,'r') as source:
    content=source.read()
    parsed_page=BeautifulSoup(content,'html.parser')
    print(type(parsed_page))
    traits=parsed_page.find_all('h1')
    for trait in traits:
        trait_name=trait.parent.contents[1].text.strip()
        trait_description=trait.parent.contents[3].text.strip()
        print(trait_name)
        print(trait_description)
        traits_dictionary[trait_name]=trait_description
print(traits_dictionary)
with open(OUTPUT_FILE,'w+') as target:
    target.write(str(traits_dictionary))
