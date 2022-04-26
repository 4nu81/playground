import numpy as np
import pandas as pd

d = {
    'col1': [0, 1, 2, 3],
    'col2': pd.Series([2, 3], index=[2, 3]),
    'col3': pd.Series([5,3], index=[1,3])
}
data_frame = pd.DataFrame(data=d, index=[0,1,2,3])

print(data_frame.dtypes)
print(data_frame)



size = 10
data_frame = pd.DataFrame({
    'float' : np.random.rand(size),
    'integer' : np.random.random_integers(low=0, high=10, size=size),
    'gamma' : np.random.gamma(shape=0.5,size=size),
    'gauss' : np.random.normal(size=size)

})

print(data_frame)
