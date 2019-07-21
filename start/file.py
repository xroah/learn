with open("./class.py") as file_object:
    content = file_object.read()
print(content)


with open("./tuples.py") as file_object:
    for line in file_object:
        print(line.rstrip())