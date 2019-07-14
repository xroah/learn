def sum(*numbers):
    print(numbers)
    
    ret = 0

    for n in numbers:
        ret +=n
    
    return ret

print(sum())
print(f"1 + 1 = {sum(1, 1)}")
print(f"1 + 2 + 3 = {sum(1, 2, 3)}")

def build_profile(first_name, last_name, **user_info):
    user_info["first_name"] = first_name
    user_info["last_name"] = last_name

    return user_info

print(
    build_profile("albert", "einstein", location="princeton", field="physics")
)