import calendar

cal = calendar.Calendar()
year = 2017
month = 4
for item in cal.itermonthdates(year, month):
    print item.isocalendar(), item.month
