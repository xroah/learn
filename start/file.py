with open("./class.py") as file_object:
    content = file_object.read()
print(content)


with open("./tuples.py") as file_object:
    for line in file_object:
        print(line.rstrip())

with open("./test.txt", "w") as file_object:
    file_object.write("aaa")

with open("./test1.txt", "a") as file_object:
    file_object.write("aaa\n")

with open("./test1.txt", "r+") as file_object:
    print(file_object.read())
    file_object.write("哈哈哈哈哈\n")