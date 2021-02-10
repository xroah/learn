from time import time

def fact(n):
    if n <= 1:
        return 1
    
    return n * fact(n - 1)

def tail_fact(n, ret=1):
    if n <= 1:
        return ret

    return tail_fact(n - 1, ret * n)

start = time()
print(f"50!={fact(50)}")
print(f"fact cost:{time() - start}")
start = time()
tail_fact(50)
print(f"tail_fact cost:{time() - start}")


def fib(n):
    if n <= 2:
        return 1
    
    return fib(n - 1) + fib(n - 2)

def tail_fib(n, prev=1, cur=1):
    if n <= 2:
        return cur
    
    return tail_fib(n - 1, cur, prev + cur)

start = time()
print(f"fib(40)!={fib(40)}")
print(f"fib cost:{time() - start}")
start = time()
tail_fib(40)
print(f"tail_fact cost:{time() - start}")
