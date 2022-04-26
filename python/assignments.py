import random
from typing import Optional


def wired_choice(i: int) -> Optional[int]:
    return random.choice(range(0, i+1))
    if r == i:
        return r


for i in range(10):
    if (a := wired_choice(i)) == i : # := assignment returns assigned value for comparison here.
        print(a)
    else:
        print('failed', a)

print(b:=2)
print(b)
