

arr = [13, 5, 54, 78, 16, 6, 43, 1, 4, 90, 50, 4, 94, 33, 56, 42, 78, 67, 20, 86]

def merge(arr, lo, mid, hi):
    aux = arr[:]
    i = lo
    j = mid + 1
    k = lo

    while(k <= hi):
        if i > mid:
            arr[k] = aux[j]
            j += 1
        elif j > hi:
            arr[k] = aux[i]
            i += 1
        elif aux[i] > aux[j]:
            arr[k] = aux[j]
            j += 1
        else:
            arr[k] = aux[i]
            i += 1
        
        k += 1


def sort1(arr, lo, hi): 
    if lo >= hi:
        return 
    
    mid = lo + int((hi - lo) / 2)
    sort1(arr, lo, mid)
    sort1(arr, mid + 1, hi)
    merge(arr, lo, mid, hi)


def sort2(arr):
    l = len(arr)
    sz = 1

    while(sz < l):
        lo = 0
        
        while(lo < l - sz):
            merge(arr, lo, lo + sz - 1, min(lo + sz * 2 - 1, l - 1))

            lo += sz * 2
            
        sz += sz


copy = arr[:]
print("original:", arr)
sort1(copy, 0, len(copy) - 1)
print("sorted1:", copy)
copy = arr[:]
sort2(copy)
print("sorted2:", copy)