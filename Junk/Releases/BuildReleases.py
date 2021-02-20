import os, time, datetime, sys
os.system("pip3 install -U selenium")
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.common.keys import Keys

import configparser

class utilities:
	def numberize(value):
		try:
			v = float(value)
			v2 = int(value)
			if v-v2 == 0:
				return v2
			return v
		except:
			return value
	#for every value in a dictionary of strings, make the value an int or a float if needed
	def IntDictionary(d):
		for x in d:
			d[x] = utilities.numberize(d[x])
		return d

class Bot:
	def __init__(self):
		self.options = webdriver.ChromeOptions();
		return

	def newSession(self):
		if hasattr(self, 'driver'):
			print("Quitting old session...")
			self.driver.quit()
		print("Creating new session...")
		#for mac
		self.driver = webdriver.Chrome(executable_path=os.getcwd()+"/chromedriver", options=self.options)
		#for linux
		#self.driver = webdriver.Chrome(options=self.options)

	def run(self):
		self.newSession()
		self.driver.get("https://distrokid.com/")
		print("Please sign in.")
		input()
		#now get all the releases
		releaseTable = self.driver.find_elements_by_xpath("//div[@style='display:table;width: 100%;padding: 0px;border: none;']")[0]
		releases = releaseTable.find_elements_by_xpath("./*")#children
		allReleases = []
		hyperfollowLinks = []
		for release in releases:
			link = release.get_attribute("href")
			photo = release.find_elements_by_xpath("./*")[1].value_of_css_property("background").split('url("')[1].split(".jpg")[0] + ".jpg".replace("300x300", "3000x3000")
			name = release.find_elements_by_xpath("./*")[2].text.split("\n")[0]
			allReleases.append([name, photo, link])
			#links = release.find_elements_by_xpath("./*")[3]
		for release in allReleases:
			self.driver.get(release[2]) #go to the link
			link = self.driver.find_elements_by_xpath("//a[contains(text(), 'visit')]")[0].get_attribute("href")
			hyperfollowLinks.append(link)
		with open("hyperfollows.txt", "w+") as f:
			f.write(str(hyperfollowLinks).replace(",", "\n"))
			f.close()



	def exit(self, thing, thing2):
		print("Stopping program...")
		if hasattr(self, 'driver'):
			print("Quitting old session...")
			self.driver.quit()
		sys.exit()

bot = Bot()
bot.run()