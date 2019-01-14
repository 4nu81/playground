#! /usr/bin/python3

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as dates
from pathlib import Path
import pickle
import re
from datetime import datetime as dt

# LogFormat "%t %{Host}i %>s %O %D \"%r\"" request
# [16/Nov/2018:09:41:06 +0100] gui-test.mms-rcs.de 200 8229 835 "GET /server-status HTTP/1.1"
#
colnames = ('datetime', 'url', 'status', 'bytes', 'servetime', 'first')
logpats = r'\[(.+?)\] (\S+) (\S+) (\S+) (\S+) \"(.*?)\"'

first_line_pattern = re.compile(r'(?P<method>\S+) (?P<path>\S+) (?P<user_agent>\S+)')
# colnames = ('host','referrer','user','datetime','method','request','proto','status','bytes','url','browser')
# logpats  = r'(\S+) (\S+) (\S+) \[(.*?)\] "(\S+) (\S+) (\S+)" (\S+) (\S+) "(\S+)" "(.+)"'
logpat   = re.compile(logpats)

rhour = r"\d+/\w+/\d+:\d+"
rday = r"\d+/\w+/\d+"
# rdomain = r"(\w+://[^/\"]+)[\/\w+]"

ds = dt.strptime
fmt = "%Y-%m-%d %H:00:00"

pattern = 'rcsear_webgui-access*'
path = '/home/am/logdata/'

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

def endpoint_duration(log, day, endpoint, duration):
    item = log.get(day, {})
    add_access_duration(item, endpoint, duration)
    log[day] = item

def endpoints_we_need(endpoint):
    endPointsOfInterest = [
        '/superlogin',
        '/register',
        '/menu',
        '/orders',
        '/password_reset_success',
        '/accounts',
        '/cancellation',
        '/impressum',
        '/content',
        '/change_template',
        '/agb',
        '/popup',
        '/privacy',
        '/reset_password',
        '/faq',
        '/contact',
    ]
    return any([endpoint.startswith(item) for item in endPointsOfInterest])

def crop_endpoint(e):
    e = e.split('?', 1)[0]
    patterns = [
        '/superlogin',
        '/contracts',
        '/reset_password',
        '/password_reset_success',
        '/verify_email',
        '/register/form',
        '/register/contract_id',
        '/register/contracts',
        '/register/success',
        '/change_template',
        '/menu',
        '/orders/2019',
        '/orders/2018',
        '/orders/2017',
        '/orders/confirmation',
        '/impressum',
        '/contact',
        '/accounts/profile',
        '/accounts/password/require',
        '/accounts/login',
        '/accounts/superlogin',
        '/accounts/logout',
        '/content',
        '/faq',
        '/agb',
        '/cancellation',
        '/privacy',
        '/popup',
        '/popup_agb',
        '/popup_cancellation',
        '/popup_privacy',
    ]
    for s in patterns:
        if e.startswith(s):
            e = s
            break
    return e

def gen_data(pattern, path):
    h_values = {}
    d_values = {}
    domains = {}
    durations = {}
    endpoints = {}

    groups = (logpat.match(line) for line in lines_from_dir(pattern, path))
    tuples = (g.groups() for g in groups if g)

    log      = (dict(zip(colnames,t)) for t in tuples)
    log      = field_map(log,"status",int)
    log      = field_map(log,"bytes",lambda s: int(s) if s != '-' else 0)
    for record in log:
        exemptions = ['media', 'static', 'apple-touch', 'favicon']
        if not any(substring in record['first'] for substring in exemptions):
            hour = re.findall(rhour, record['datetime'])[0]
            increase_key(h_values, hour)
            add_access_duration(log=durations, key=hour, duration=record['servetime'])

            day = re.findall(rday, record['datetime'])[0]
            increase_key(d_values, day)

            first = first_line_pattern.match(record['first'])
            if first:
                first = first.groupdict()

                endpoint = crop_endpoint(first['path'])
                if endpoints_we_need(endpoint):
                    endpoint_duration(log=endpoints, day=day, endpoint=endpoint, duration=record['servetime'])

            increase_key(domains, record['url'])

    #servetime comes in microseconds, so it is converted to ms for we only care about that scale
    durations = { key: int(value['duration'] / value['amount'] / 1000) for key,value in durations.items()}

    def calc_average(day):
        return { endpoint: int(value['duration'] / value['amount'] / 1000) for endpoint, value in day.items()}
    endpoints = { day: calc_average(value) for day,value in endpoints.items()}

    return h_values, d_values, domains, durations, endpoints

def pickle_dump(h_vals, d_vals, domains, durations, endpoints):
    with open('/tmp/h_data.pickle', 'wb') as f:
        pickle.dump(h_vals, f, pickle.HIGHEST_PROTOCOL)
    with open('/tmp/d_data.pickle', 'wb') as f:
        pickle.dump(d_vals, f, pickle.HIGHEST_PROTOCOL)
    with open('/tmp/domains.pickle', 'wb') as f:
        pickle.dump(domains, f, pickle.HIGHEST_PROTOCOL)
    with open('/tmp/durations.pickle', 'wb') as f:
        pickle.dump(durations, f, pickle.HIGHEST_PROTOCOL)
    with open('/tmp/endpoints.pickle', 'wb') as f:
        pickle.dump(endpoints, f, pickle.HIGHEST_PROTOCOL)

def pickle_load():
    with open('/tmp/h_data.pickle', 'rb') as f:
        h_vals = pickle.load(f)
    with open('/tmp/d_data.pickle', 'rb') as f:
        d_vals = pickle.load(f)
    with open('/tmp/domains.pickle', 'rb') as f:
        domains = pickle.load(f)
    with open('/tmp/durations.pickle', 'rb') as f:
        durations = pickle.load(f)
    with open('/tmp/endpoints.pickle', 'rb') as f:
        endpoints = pickle.load(f)
    return h_vals, d_vals, domains, durations, endpoints

def plot_data(h_vals, d_vals, durations):
    # alter keys du unified format
    h_vals = {dt.strptime(key, "%d/%b/%Y:%H").strftime(fmt):value for key, value in h_vals.items()}
    d_vals = {dt.strptime(key, "%d/%b/%Y").strftime(fmt):value for key, value in d_vals.items()}
    durations = {dt.strptime(key, "%d/%b/%Y:%H").strftime(fmt):value for key, value in durations.items()}

    def get_min_max(vals):
        min = ds(next(iter(vals)), fmt)
        max = ds(next(iter(vals)), fmt)
        for key in vals:
            min = ds(key, fmt) < min and ds(key, fmt) or min
            max = ds(key, fmt) > max and ds(key, fmt) or max
        return min, max
    min, max = get_min_max(h_vals)
    idx = pd.date_range(start=min, end=max, freq='H')
    df = pd.DataFrame(index=idx, columns=['h_count','d_count', 'duration'])
    df['h_count'] = pd.to_numeric(df['h_count'])
    df['d_count'] = pd.to_numeric(df['d_count'])
    df['duration'] = pd.to_numeric(df['duration'])

    #populate
    for key, h_value in h_vals.items():
        d_value = d_vals.get(key, np.NaN)
        duration = durations[key]
        df.loc[key] = [h_value, d_value, duration]

    df2 = df[df.d_count.notnull()]

    xticks = [item for item in idx if item.hour == 0]
    xlabels = [dt.strftime(item, "%a %b %d") for item in xticks]

    fig,ax1 = plt.subplots(figsize=(30,10), dpi=200)

    plt.xticks(fontweight='bold', horizontalalignment='left')
    plt.yticks(fontweight='bold')



    color = '#AAAAFF'
    ax1.set_xlabel('date')
    ax1.set_ylabel('n/d')
    ax1.bar(df2.index, df2['d_count'], color=color, width=1, align='edge', edgecolor='#000099', linewidth=1)
    ax1.tick_params(axis='y', labelcolor=color)



    ax2 = ax1.twinx() #share the x axis

    color = '#FF0000'
    ax2.set_ylabel('n/h')
    ax2.plot(df.index, 'h_count', data=df, color=color, linewidth=2)
    ax2.tick_params(axis='y', labelcolor=color)



    ax3 = ax2.twinx()

    color = '#00FF00'
    ax3.set_ylabel('T/n')
    ax3.plot(df.index, 'duration', data=df, color=color, linewidth=2)



    plt.minorticks_on()

    plt.xticks(ticks=xticks, labels=xlabels)
    ax1.xaxis.set_minor_locator(dates.HourLocator(byhour=range(0, 24, 6)))

    ax1.grid(b=True, which="minor", axis="x", color="r", linestyle=":")
    ax1.grid(b=True, which="major", axis="x", color="b", linestyle="-")

    fig.tight_layout()

    plt.savefig('/home/am/logdata/out2.png', format='png')

def plot_domains(domains):
    df = pd.DataFrame.from_dict(domains, orient='index', columns=['count'])
    df = df.sort_values('count')
    #df = df[df['count'] > 10000] # schneidet alle Einträge mit weniger als 10000 aufrufen ab.
    fig, ax = plt.subplots(figsize=(100,10), dpi=200)
    df.plot(kind='bar', ax=ax, title="Domains")# with calls > 10000")
    fig.tight_layout()
    plt.savefig('/home/am/logdata/pie2.png', format='png')

h_vals, d_vals, domains, durations, endpoints = gen_data(pattern, path)
pickle_dump(h_vals, d_vals, domains, durations, endpoints) # for dev
h_vals, d_vals, domains, durations, endpoints = pickle_load() # for dev
plot_data(h_vals, d_vals, durations)
plot_domains(domains)

import json
with open('endpoints.dump', 'w') as f:
    f.write(json.dumps(endpoints, indent=4, sort_keys=True))
