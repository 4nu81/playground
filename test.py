def mirrorBits(a):
    res = a & 1
    a = a >> 1
    while a > 0:
        res = res << 1
        res += a & 1
        a = a >> 1
    return res

print mirrorBits(240)
