def sum(*numbers):
    print(numbers)
    
    ret = 0

    for n in numbers:
        ret +=n
    
    return ret

print(sum())
print(f"1 + 1 = {sum(1, 1)}")
print(f"1 + 2 + 3 = {sum(1, 2, 3)}")