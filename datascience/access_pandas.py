#! /usr/bin/python3

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as dates
from pathlib import Path
import pickle
import re
from datetime import datetime as dt

rh = r"\d+/\w+/\d+:\d+"
rd = r"\d+/\w+/\d+"

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

def gen_data(pattern, path):
    h_values = {}
    d_values = {}
    for line in lines_from_dir(pattern, path):
        try:
            key = re.findall(rh, line)[0]
            add_time(h_values, key)
            key = re.findall(rd, line)[0]
            add_time(d_values, key)
        except:
            continue
    return h_values, d_values

d = dt.strptime
fmt = "%Y-%m-%d %H:00:00"

def plot_data(h_vals, d_vals):
    h_vals = {dt.strptime(key, "%d/%b/%Y:%H").strftime(fmt):value for key, value in h_vals.items()}
    d_vals = {dt.strptime(key, "%d/%b/%Y").strftime(fmt):value for key, value in d_vals.items()}
    def get_min_max(vals):
        min = d(next(iter(vals)), fmt)
        max = d(next(iter(vals)), fmt)
        for key in vals:
            min = d(key, fmt) < min and d(key, fmt) or min
            max = d(key, fmt) > max and d(key, fmt) or max
        return min, max
    min, max = get_min_max(h_vals)
    idx = pd.date_range(start=min, end=max, freq='H')
    df = pd.DataFrame(index=idx, columns=['h_count','d_count'])
    df['h_count'] = pd.to_numeric(df['h_count'])
    df['d_count'] = pd.to_numeric(df['d_count'])

    #populate
    for key, h_value in h_vals.items():
        d_value = d_vals.get(key, np.NaN)
        df.loc[key] = [h_value, d_value]

    df2 = df[df.d_count.notnull()]

    xticks = [item for item in idx if item.hour == 0]
    xlabels = [dt.strftime(item, "%b %d") for item in xticks]

    fig,ax1 = plt.subplots(figsize=(30,10), dpi=200)

    plt.xticks(fontweight='bold', horizontalalignment='left')
    plt.yticks(fontweight='bold')

    color = '#AAAAFF'
    ax1.set_xlabel('date (hrs)')
    ax1.set_ylabel('count per day')
    ax1.bar(df2.index, df2['d_count'], color=color, width=1, align='edge', edgecolor='#000099', linewidth=1)
    ax1.tick_params(axis='y', labelcolor=color)



    ax2 = ax1.twinx()

    color = '#FF0000'
    ax2.set_ylabel('count per hour')
    ax2.plot(df.index, 'h_count', data=df, color=color, linewidth=2)
    ax2.tick_params(axis='y', labelcolor=color)

    plt.xticks(ticks=xticks, labels=xlabels)
    ax1.xaxis.set_minor_locator(dates.HourLocator(interval=6))

    plt.minorticks_on()
    ax1.grid(b=True, which="major", axis="x", color="b", linestyle="-")
    ax1.grid(b=True, which="minor", axis="x", color="r", linestyle="--")

    fig.tight_layout()

    plt.savefig('out.png', format='png')


# pattern = 'rcsear_web*'
# path = '/home/am/projects/playground/datascience/'
# h_vals, d_vals = gen_data(pattern, path)
# with open('h_data.pickle', 'wb') as f:
#    pickle.dump(h_vals, f, pickle.HIGHEST_PROTOCOL)
# with open('d_data.pickle', 'wb') as f:
#    pickle.dump(d_vals, f, pickle.HIGHEST_PROTOCOL)
with open('h_data.pickle', 'rb') as f:
    h_vals = pickle.load(f)
with open('d_data.pickle', 'rb') as f:
    d_vals = pickle.load(f)
plot_data(h_vals, d_vals)
