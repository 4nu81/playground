import json

class test_object(object):
    pass

my_object = test_object()
my_object.name = "some name"
my_object.digit = 1337
my_object.sub_object = test_object()
my_object.sub_object.name = "sub_name"
my_object.sub_object.digit = 1338


exclude = [int,float,dict,list,str,unicode,set]

def var_dump(the_object):
    attrs = dir(the_object)
    res = {}
    for att in attrs:
        if not att.startswith('__'):
            value = the_object.__dict__[att]
            if type(value) not in exclude:
                value = var_dump(value)
            res[att] = value
    return res

s = var_dump(my_object)
print json.dumps(s, sort_keys=True, indent=4, separators=(',', ':'))
