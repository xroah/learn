def pow_list(list):
    for index, value in enumerate(list):
        list[index] = value ** 2

list = [value for value in range(1, 10)]

print("before:")
print(list)
pow_list(list)
print("after:")
print(list)

list2 = [value for value in range(3, 6)]

print("===before:===")
print(list2)
pow_list(list2[:])
print("===after===")
print(list2)