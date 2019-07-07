list = []

if list:
    print(list)
else:
    print("list is empty")

list = [value for value in range(1, 50)]

for item in list:
    if item > 10 and item % 2 == 0:
        print(item)
    elif item % 3 == 0 or item % 5 == 0:
        print(f"item={item}")