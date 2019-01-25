#! /usr/bin/python3

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as dates
from pathlib import Path
import pickle
import re
from datetime import datetime as dt
import sys, argparse

# LogFormat "%t %{Host}i %>s %O %D \"%r\"" request
# [16/Nov/2018:09:41:06 +0100] gui-test.mms-rcs.de 200 8229 835 "GET /server-status HTTP/1.1"
#
colnames = ('datetime', 'url', 'status', 'bytes', 'servetime', 'first')
logpats = r'\[(.+?)\] (\S+) (\S+) (\S+) (\S+) \"(.*?)\"'

first_line_pattern = re.compile(r'(?P<method>\S+) (?P<path>\S+) (?P<user_agent>\S+)')
# colnames = ('host','referrer','user','datetime','method','request','proto','status','bytes','url','browser')
# logpats  = r'(\S+) (\S+) (\S+) \[(.*?)\] "(\S+) (\S+) (\S+)" (\S+) (\S+) "(\S+)" "(.+)"'
logpat   = re.compile(logpats)

rmin = r"\d+/\w+/\d+:\d+:\d+"
rhour = r"\d+/\w+/\d+:\d+"

ds = dt.strptime
fmt = "%Y-%m-%d %H:%M:00"

def field_map(dictseq, name, func):
    for d in dictseq:
        d[name] = func(d[name])
        yield d

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

def increase_key(log, key):
    item = log.get(key, 0)
    log[key] = item + 1

def add_access_duration(log, key, duration):
    item = log.get(key, {'amount': 0, 'duration':0})
    item['amount'] += 1
    item['duration'] += float(duration)
    log[key] = item

def gen_data(pattern, path):
    print (pattern, path)

    m_values = {}
    h_values = {}
    durations = {}

    groups = (logpat.match(line) for line in lines_from_dir(pattern, path))
    tuples = (g.groups() for g in groups if g)

    log      = (dict(zip(colnames,t)) for t in tuples)
    log      = field_map(log,"status",int)
    log      = field_map(log,"bytes",lambda s: int(s) if s != '-' else 0)
    for record in log:
        exemptions = ['media', 'static', 'apple-touch', 'favicon']
        if not any(substring in record['first'] for substring in exemptions):
            min = re.findall(rmin, record['datetime'])[0]
            increase_key(m_values, min)
            add_access_duration(log=durations, key=min, duration=record['servetime'])

            hour = re.findall(rhour, record['datetime'])[0]
            increase_key(h_values, hour)

    durations = { key: int(value['duration'] / value['amount'] / 1000) for key,value in durations.items()}

    return m_values, h_values, durations

def plot_data(m_vals, h_vals, durations, outputfile):
    # alter keys du unified format
    m_vals = {dt.strptime(key, "%d/%b/%Y:%H:%M").strftime(fmt):value for key, value in m_vals.items()}
    h_vals = {dt.strptime(key, "%d/%b/%Y:%H").strftime(fmt):value for key, value in h_vals.items()}
    durations = {dt.strptime(key, "%d/%b/%Y:%H:%M").strftime(fmt):value for key, value in durations.items()}

    def get_min_max(vals):
        min = ds(next(iter(vals)), fmt)
        max = ds(next(iter(vals)), fmt)
        for key in vals:
            min = ds(key, fmt) < min and ds(key, fmt) or min
            max = ds(key, fmt) > max and ds(key, fmt) or max
        return min, max
    min, max = get_min_max(m_vals)
    idx = pd.date_range(start=min, end=max, freq='T')
    df = pd.DataFrame(index=idx, columns=['m_count','h_count', 'duration'])
    df['m_count'] = pd.to_numeric(df['m_count'])
    df['h_count'] = pd.to_numeric(df['h_count'])
    df['duration'] = pd.to_numeric(df['duration'])

    #populate
    for key, m_value in m_vals.items():
        h_value = h_vals.get(key, np.NaN)
        duration = durations[key]
        df.loc[key] = [m_value, h_value, duration]

    df2 = df[df.h_count.notnull()]

    xticks = [item for item in idx if item.minute == 0]
    xlabels = [dt.strftime(item, "%X") for item in xticks]

    fig,ax1 = plt.subplots(figsize=(30,10), dpi=200)

    plt.xticks(fontweight='bold', horizontalalignment='left')
    plt.yticks(fontweight='bold')



    color = '#AAAAFF'
    ax1.set_xlabel('hour')
    ax1.set_ylabel('n/h')
    ax1.bar(df2.index, df2['h_count'], color=color, width=0.04155, align='edge', edgecolor='#000099', linewidth=1)
    ax1.tick_params(axis='y', labelcolor=color)



    ax2 = ax1.twinx() #share the x axis

    color = '#FF0000'
    ax2.set_ylabel('n/m')
    ax2.plot(df.index, 'm_count', data=df, color=color, linewidth=2)
    ax2.tick_params(axis='y', labelcolor=color)



    ax3 = ax2.twinx()

    color = '#00FF00'
    ax3.set_ylabel('T/n')
    ax3.plot(df.index, 'duration', data=df, color=color, linewidth=2)



    plt.minorticks_on()

    plt.xticks(ticks=xticks, labels=xlabels)
    ax1.xaxis.set_major_locator(dates.HourLocator(byhour=range(24)))
    ax1.xaxis.set_minor_locator(dates.MinuteLocator(byminute=range(0, 60, 20)))

    ax1.grid(b=True, which="minor", axis="x", color="r", linestyle=":")
    ax1.grid(b=True, which="major", axis="x", color="b", linestyle="-")

    fig.tight_layout()

    plt.savefig(outputfile+'.png', format='png')

def parse_opts():
    filepattern = 'access.log'
    path = '/home/am/logdata/'
    outputfile = '/home/am/logdata/out.png'

    parser = argparse.ArgumentParser()
    parser.add_argument('-f', '--filepattern', help="Input File Pattern to work on", default='access.log')
    parser.add_argument('-p', '--path', help="Path to the Files to work on", default='/home/am/logdata')
    parser.add_argument('-o', '--outfile', help="Outputfilename (.png)", default='/home/am/logdata/out')
    args = parser.parse_args()
    m_vals, h_vals, durations = gen_data(args.filepattern, args.path)
    if m_vals and h_vals and durations:
        plot_data(m_vals, h_vals, durations, args.outfile)
    else:
        print ('nothing to do')

if __name__ == "__main__":

    parse_opts()
