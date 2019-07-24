list = [1, 2, 3, 5, 50, 11]
empty = []

for item in list:
    print("list", item)
else:
    print("hhh")

for item in list:
    print("======", item)

    if item == 5:
        break
else:
    print("hhh")

for item in empty:
    print("aaa")
else:
    print("ttt")