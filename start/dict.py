name = "name"

jack = {
    name: "Jack",
    "age": 28,
    "gender": "male"
}

#KeyError: 'hometown
#print(jack["hometown"])

print(jack.get("hometown"))
print(jack.get("age"))
print(jack.get(name))
print(jack.get("nation", "China"))

print(jack.items())

for k, v in jack.items():
    print(f"{k}={v}")

print(jack.keys())
print(jack.values())