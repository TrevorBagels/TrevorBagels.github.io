import toml, datetime
from pytz import timezone
stream_desc = ""

data = toml.load("streams.toml")
#with open("ukraine.streams.toml", "r") as f: data = json.loads(f.read())

for x in data['streams']:
	stream_desc += x['label'] + ": " + x['link'] + "\n"


now = datetime.datetime.now().astimezone(timezone("Europe/Kiev"))
print("Last updated", now.strftime("%m/%d/%Y, %H:%M:%S"), "(GMT +2)")
print(stream_desc)