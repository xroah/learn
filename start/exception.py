try:
    5/0
except ZeroDivisionError:
    print("Can not divide by zero")

a = input("Please input dividend: ")
b = input("Please input divisor: ")

try:
    a = float(a)
    b = float(b)
    q = a / b
except Exception as e:
    # print("Error", e)
    pass
else:
    print("result=%s" % q)
