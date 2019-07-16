def sum(*numbers):
    ret = 0

    for n in numbers:
        ret += n
    
    return ret

def pow(base, exp):
    i = 0
    ret = base

    while(i < exp - 1):
        ret *= base

        i += 1
    
    return ret