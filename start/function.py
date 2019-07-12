def greet_user(username = "mary"):
    """Simple function"""
    print(f"Hello {username.title()}")

def print_info(name, age):
    print(f"name={name}, age={age}")

greet_user()
greet_user("jack")
print_info(20, "Jack")
print_info(age = 20, name = "Jack")