from pydoc import locate

mandator = 'mandator'

my_func = locate('my_mod.{mandator}.my_func'.format(mandator=mandator))
if my_func:
    print my_func()
else:
    my_func = locate('my_mod.default.my_func')
    print my_func()
