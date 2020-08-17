import os
txt = ""
for x in os.listdir():
	txt += ("<img src='Images/" + x + "'>\n")
with open('thing.txt', "w+") as f:
	f.write(txt)
