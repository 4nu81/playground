import datetime
import inspect

str_value = "holymoly 🐶"
int_value = 123

print(f'function: {inspect.currentframe().f_code.co_name}()')
print(f'the value is {str_value}')
print(f'{str_value= }')
print(f'{str_value!a}') #ascii representation
print(f'{str_value!r}') #__repr__ conversion operator
print(f'{str_value!s}') #__str__ conversion operator - default - will be applied before formatting
print(f'{int_value % 2 = }')

def formatting():
    num_value = 123.456
    num_value2 = 15123.1231
    now = datetime.datetime.utcnow()
    precision = ".2f"
    width = 15
    print(f'function: {inspect.currentframe().f_code.co_name}()')
    print(f'{now = :%Y-%m-%d}')
    print(f'{num_value = :{precision}}')
    print(f'{num_value2=}')
    print(f'{num_value = :0{width}{precision}}')
    print(f'{num_value2= :{width}{precision}}')
    print(f'{num_value2= :{width}}')
    print(f'{int_value = :0{width}}')
    print(f'{int_value = :{width}{precision}}')

formatting()