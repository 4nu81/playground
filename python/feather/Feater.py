import timeit
from time import time

import numpy as np
import pandas as pd

import feather


def data_frame():
    size = 10000000
    df = pd.DataFrame({
        'a' : np.random.rand(size),
        'b' : np.random.rand(size),
        'c' : np.random.rand(size),
        'd' : np.random.rand(size)
    })
    return df


def save_to_feather(df: pd.DataFrame):
    df.to_feather('large.feather')

def read_from_feather() -> pd.DataFrame:
    return pd.read_feather('large.feather')

def save_to_csv(df: pd.DataFrame):
    df.to_csv('large.csv')

def read_from_csv() -> pd.DataFrame:
    return pd.read_csv('large.csv')


def main():
    duration_feather = 0
    duration_csv = 0
    runs = 2
    for _ in range(runs):
        df = data_frame()
        start = timeit.default_timer()
        save_to_feather(df)
        _ = read_from_feather()
        duration_feather += timeit.default_timer() - start

        start = timeit.default_timer()
        save_to_csv(df)
        _ = read_from_csv()
        duration_csv += timeit.default_timer() - start

    print(f'{runs} x feather -> {duration_feather / runs} ms')
    print(f'{runs} x csv     -> {duration_csv / runs} ms')

if __name__ == "__main__":
    main()
