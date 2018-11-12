"""
this is an Iteratior: [for x in y]

this is a Generator: (for x in y)
It can be uesed as processing pipeline

example:
with open("access-log") as wwwlog:
    bytecolumn = (line.rsplit(None, 1)[1] for line in wwwlog)
    bytes_sent = (int(x) for x in bytecolumn if x != '-')
    print ("Total", sum(bytes_sent))


find files on filesystem:

from pathlib import Path
Path('/').rglob('*.py')
it uses generators so it can be pipelined too

from pathlib import Path
def lines_from_dir(filepattern, dirname):
    names = Path(dirname).rglob(filepattern)
    files = gen_open(names)
    lines = gen_cat(files)
    return lines


def apache_log(lines):
    groups = (logpatterns.match(line) for line in lines)
    tuples = (g.groups() for g in groups if g)

    colnames = ('host', 'referrer', 'user', 'datetime', 'method', 'request', 'proto', 'status', 'bytes')

    log = (dict(zip(colnames,t)) for t in tuples)
    log = field_map(log, "bytes", lambda s: int(s) if s != '-' else 0)
    log = field_map(log, "status", int)

    return log

"""

# apachelog.py
# Parse an apache log file into a sequence of dictionaries

from fieldmap import field_map

import re

logpats  = r'(\S+) (\S+) (\S+) \[(.*?)\] ' \
           r'"(\S+) (\S+) (\S+)" (\S+) (\S+)'

logpat   = re.compile(logpats)

def apache_log(lines):
    groups = (logpat.match(line) for line in lines)
    tuples = (g.groups() for g in groups if g)
    
    colnames = ('host','referrer','user','datetime',
                'method', 'request','proto','status','bytes')

    log      = (dict(zip(colnames,t)) for t in tuples)
    log      = field_map(log,"status",int)
    log      = field_map(log,"bytes",
                         lambda s: int(s) if s != '-' else 0)

    return log

# Example use:

if __name__ == '__main__':
    from linesdir import lines_from_dir
    lines = lines_from_dir("access-log*","www")
    log = apache_log(lines)
    for r in log:
        print(r)
