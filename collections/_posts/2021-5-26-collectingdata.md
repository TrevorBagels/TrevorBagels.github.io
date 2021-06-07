---
layout: post
title:  "Collecting Data"
desc: ""
tags: ["data", "mongodb"]
hidden: false
---

## Introduction

Data. Really, it’s just organized information. And organized information can be vital to investigations, which is what this post is about. 
Aside from investigations, it can be extremely useful to advertisers, and they'll pay lots of money for data on individuals, which is a big reason that data brokers exist. And because there's a market for this data, companies that offer free services tend to collect as much of *your data* as possible, so that they can sell your data to data brokers, who sell the data to advertisers. 

But back to investigations; data brokers can build reports on individual people and sell them as background checks. Many companies use in their hiring processes, and even government agencies rely on data brokers when conducting investigations. That’s cool and all (it really isn’t, it’s an invasion of privacy, as literally anyone with money can pay thirty bucks and find where you live, work, get details like your SSN, date of birth, etc), but why pay these data brokers if you can become one yourself?

For the typical person, it’s too much of a hassle to try and set up a system to do that, and a typical person can’t just pay Facebook and get all of their information. So really, if you try to do this, you aren’t as powerful as an actual data broker. But it’s still possible, it’s just not as sophisticated.

So, to start, where do you get the data? There’s a couple of options here.

## Web Scraping

Scraping is probably the most difficult way to collect data, but if done right, it can be pretty efficient. Scraping is, in simple terms, when you have an automated system that interprets information from something like a webpage or an API endpoint. It’s a huge topic, and there are numerous ways of going about it, and again, it’s difficult, and it becomes increasingly difficult as companies implement countermeasures to prevent automated scraping on their websites. 

Generally, someone will find a vulnerability in some company's site that makes scraping much easier, and they'll set up a program to exploit this vulnerability in order to scrape as much data as possible. Back in 2019, somebody scraped about 533 million accounts from Facebook, which is a little under 20% of Facebook's entire user base. In June of 2020, they posted the data for sale on an online forum. The data contained information such as account IDs, names, relationship status, and, most importantly, phone numbers, which aren't visible on Facebook profiles, but the vulnerability allowed the scraper to find the phone numbers with ease. Earlier this year, somebody decided to share the data to the public for free. People got pretty hyped about it, calling it a huge "data breach." By the way, it wasn't a breach, it was a leak since there wasn't any unauthorized access being used to obtain the data. <!--And let me tell you, it was a real pain in the neck to download, because the data was organized by country, and there was a download link for each country. And there were about 110 different countries included in the leak, so I probably spent a couple hours clicking on those links and completing captchas to download the content. -->

If you're worried that you might've been exposed in this scrape, I recommend checking <a target="_blank" href="https://haveibeenzucked.com/">haveibeenzucked</a> to find out. 

## Data Breaches and Leaks

Typically, breaching data is illegal (if you gained unauthorized access to the system, you've broken one of the CFAA rules), however, once the breached data is published somewhere inconspicuous on the internet, it becomes public information. And having public information is not illegal.

There are sites and forums where you can get these leaks for free, generally by participating in the forum discussions, earning credits, and then spending those credits to unlock download links to the data breaches/leaks.

While I’m *somewhat* okay with all this sensitive data being available to the public, I’m not going to say where these places are, as raising awareness of where you can go to download this data would be a dangerous move for me. People on these sites don’t like it when someone tells everyone about their site, and also, more awareness tends to lead to more abuse of this information.

## Storing your Data

To collect and use all this data, you’ll also need somewhere to store it. Right now, I’m using a 4TB external HDD to store my live database; although, it’s had some issues, and it isn’t the most reliable drive. It was a relatively cheap drive, but I've nearly lost all the data on it multiple times. It’d suck to have spent several months collecting multiple terabytes of data dumps only for the hard drive to completely fail and to lose everything.

Take this advice with a grain of salt, because I've never done this myself, but, if you're concerned about losing your data because of hardware failure, consider getting a RAID. Basically, it's an array of hard drives that are pretty much just copies of each other, and so if one drive fails, you'll still have like three others to recover from.

## Using your Data

Ok, so once you’ve got your data, you’ll need a way to search through it. A lot of people like to use Grep, which is a command-line utility that lets you search for text. Grep is great for reading a file and searching for specific things in that file, but when it comes to trying to find info in terabytes of leaked data, you’ll find it rather slow. Ripgrep is a much better alternative; it’s the same thing, but more optimized for speed. So, Grep and Ripgrep are good for their ease of use. But, again, when searching through a lot of data, they won’t be the fastest. Even Ripgrep can be slow, it took about 5 minutes for Ripgrep to run a regex search in less than a GB of text files on my relatively new Mac. Having a live database that can handle billions of records would be much more preferable if you’re aiming for speed. And that’s what I’ve been doing, for the most part.

Lots of people like to use SQL, which is fine, although MongoDB has been said to be faster than SQL, better optimized for large datasets, and it can handle more advanced types of documents. And, because of that, I prefer MongoDB, and I wrote a program designed for searching through multiple databases. There’s a few problems with using a database rather than just grepping a bunch of files though. As I said, Grep is the easiest method, since it’s just a text search program. Having a database means you need a way to import all of your data, which isn’t always easy.

When leaked data gets published online, it’s often a zip file filled with a bunch of text files, usually from different contributors. This leads to many problems. The contributors don't always format their data in the same ways, meaning you have to inspect each file to figure out how to parse it and import it. Sometimes you’ll get a bunch of data, but no headers (labels) for the columns. Or, you'll get like thirty files, and some of them will be CSV, some will be TXT, but the headers in the CSV files are all slightly different. Having to manage this, when handling *hundreds* of leaks, can be a huge hassle, which again, is probably why most people just use Grep.

What's worse, is that I've had the data format change *within the same text file!* A few months back, I was parsing through a combolist, where the data was formatted like this:
```
username:password
```
and halfway through the file, it turned into
```
username;password
```
making it even more difficult to parse through. It gets worse when the username or password also contains `:` or `;`, because then you don't have a way of determining where the username ends, and where the password starts. Generally, I'll have to make a Python script to analyze the file, and report things like the delimiter being used multiple times in the same row, because just running parsing scripts blindly can make things harder later on.

Thankfully, combolists aren't too useful, as they're mostly just good for finding what online accounts someone might use, and they can give you insight into their security practices (based on their passwords.) And, I suppose having *access* to those accounts might be useful for some people, although that's gaining unauthorized access to a system/account, which violates the CFAA. So I wouldn't recommend doing that, unless you want to commit a crime, or you're working for the government and have permission to do that. 
I'm pretty sure the FBI gets away with accessing accounts all the time since the CFAA doesn't actually define "authorization", therefore the government could probably just argue that they're authorized because they're the government.
Additionally, if you have a target's frequently used password, and the password is fairly unique, you can run a search on that password through all your combolists to find any aliases they might go by (if they use the same password for everything.) But yeah, other than that, combolists aren't of much use. 

## Leakscoop

Anyways, back to MongoDB. If you've been converting all your data to MongoDB collections, and need a way to run a query on every possible collection that you've obtained, <a href="https://github.com/TrevorBagels/leakscoop" target="_blank">LeakScoop</a> might be a decent solution. It's a program I wrote to make it easier to run queries on people without having to memorize the structure and schema of each collection and enter the information manually. It lets you configure each collection, defining which fields represent what types of info, how fields are formatted, when to use and when not to use the collection when querying, etc. It's still in development, so feel free to report issues with the program if you use it. 

I'll probably be writing another post going over how to use Leakscoop, and once that's done, I'll put the link here.

## Conclusion

Anyways, that's pretty much it. And, by the way, breach data and leaked data aren't the only ways to find details on a target. They can be good for getting new leads, sometimes sensitive details that wouldn't be accessible from the surface web. But in general, an entire investigation can usually turn out to be pretty successful just by going over what's openly viewable on the internet. 