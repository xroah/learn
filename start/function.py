def greet_user(username = "mary"):
    """Simple function"""
    print(f"Hello {username.title()}")

def print_info(name, age):
    print(f"name={name}, age={age}")

def sum(a, b):
    return a + b

def pow_list(list):
    for index, value in enumerate(list):
        list[index] = value ** 2

greet_user()
greet_user("jack")
print_info(20, "Jack")
print_info(age = 20, name = "Jack")

#TypeError: print_info() missing 2 required positional arguments: 'name' and 'age':
#print_info()

print(sum(1, 1))

list = [value for value in range(1, 10)]

print("before:")
print(list)
pow_list(list)
print("after:")
print(list)