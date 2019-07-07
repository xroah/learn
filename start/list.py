list = [value ** 2 for value in range(1, 10)]

print(list)

print(list[2:])
print(list[:5])
print(list[-3:])
print(list[:])

list2 = list

list.insert(1, 88)

print("========")
print(list)
print(list2)

print("=====")

list2 = list[:]

list2.insert(3, 99)
list.insert(3, 999)

del list2[0]

print(list)
print(list2)