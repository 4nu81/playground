#! /usr/bin/python3

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import re

rh = r"\d+/\w+/\d+:\d+"

def gen_cat(sources):
    """
    takes a sequence of open file objects and yields a sequence of lines from that files
    """
    for src in sources:
        yield from src

def gen_open(paths):
    """
    takes sequence of paths and yields a sequence of open file objects
    """
    for path in paths:
        yield open(str(path), 'rt')

def lines_from_dir(filepattern, dirname):
    names = Path(dirname).rglob(filepattern)
    files = gen_open(names)
    lines = gen_cat(files)
    return lines

def add_time(log, key):
    item = log.get(key, 0)
    log[key] = item + 1

def gen_logs(filename):
    print('working... ', filename)
    with open(filename, 'r') as f:
        for line in f:
            yield line

def gen_data(pat):
    values = {}
    for line in lines_from_dir(pat, '/home/am/datascience'):
        try:
            key = re.findall(rh, line)[0]
            add_time(values, key)
        except:
            continue
    return values

def plot_data(vals):

    #idx = pd.date_range()
    df = pd.DataFrame(list(vals.items()), columns=['date', 'value'])
    df['date'] = pd.to_datetime(df['date'], format="%d/%b/%Y:%H")
    df.sort_values('date')
    #df.set_index(['date'], drop=False, inplace=True)
    print(df)

    sns.set(style='dark')
    sns.despine()
    sns.set_context("paper")
    sns.set_style("ticks", {"xtick.major.size": 1, "xtick.minor.size": .5})

    #https://seaborn.pydata.org/generated/seaborn.relplot.html
    plot = sns.relplot(x='date',y='value', data=df, kind='line', height=10, aspect=2)
    plot.fig.autofmt_xdate(bottom=0.1,rotation=90)
    plot.savefig("out.png", dpi=400, format="png")
    #plot.savefig("out.svg", dpi=400, format="svg")

pat = 'access.log'
vals = gen_data(pat)
plot_data(vals)
