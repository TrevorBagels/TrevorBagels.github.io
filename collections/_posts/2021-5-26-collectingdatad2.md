---
layout: post
title:  "Collecting Data"
desc: "i wrote this for a school assignment so it's probably long, overstretched, and boring."
tags: ["data"]
hidden: true
---
## Introduction

Data. Really, it's just organized information. Some of it is wonderful, some of it is useless, but where does it come from? Well, thanks to the internet, data comes from just about anyone that uses the internet, whether they want to share it or not. Aside from being able to act as a system for shopping for physical products, all the internet really is, is a way for information to be exchanged between users.

Without the internet, we wouldn't have such easy methods of sharing information, aside from calling someone up on the phone, telling someone something in person, or doing something that's interesting enough to hit the news outlets.

With a network this basic, information doesn't go very far; it tends to stay between people that know each other.

But with the internet, that information goes everywhere. It goes to anyone that wants it, regardless if they know the people that it belongs to. And with information capable of traveling so far in such a short amount of time, as with any major technological advancement, people looking for money or power are going to get involved. And now we've got Google and Facebook, and tons of other companies that are making money because of this advancement.

You'll notice that these companies don't offer many products that you spend money on, and that's because you're paying them simply by using their service. Well, no, you aren't paying them, but you are giving them their product, which is later bought by data brokers. With the internet, traveling from one place to another is instantaneous. And now, pretty much anyone can start a business and have billions of customers if their product or service is good enough. And the large user bases that corporations such as Google or Facebook have, are valuable to marketing firms.

By automatically collecting your data, and analyzing it with something like AI, advertisers no longer have the need to use mass advertising techniques, which is rather expensive. Instead, they use your data to determine what advertisements are the best fit for you, and therefore more likely to succeed. And they'll pay money for this information, like, lots of money.

## Becoming your own "data broker"

Aside from advertisers, data brokers (who buy your data then resell it to advertisers), can also build reports on individual people and sell them as background checks. Many companies use this when hiring somebody, and even government agencies use the data brokers when conducting investigations.
That's cool and all (it really isn't, it's an invasion of privacy, as literally anyone with money can pay thirty bucks and find where you live, work, get details like your SSN, date of birth, etc), but why pay these data brokers if you can become one yourself?

For the typical person, it's too much of a hassle to try and set up a system to do that, and a typical person can't just pay Facebook and get all of their information. So really, if you try to do this, you aren't as powerful as an actual data broker. But it's still possible, it's just not as sophisticated.

So, to start, where do you get the data? There's a couple of options here.

## Web Scraping

Scraping is probably the most difficult way to collect data, but if done right, it can be pretty efficient. Scraping is, in simple terms, when you have an automated system that interprets information from something like a webpage. It's a huge topic, and there are numerous ways of going about it, and again, it's difficult, and it becomes increasingly difficult as companies implement countermeasures to prevent automated scraping on their websites.

## Data Breaches

Typically, breaching data is illegal (if you gained unauthorized access to the system, that constitutes a federal crime in the US), however, once the breached data is published somewhere inconspicuous on the internet, it becomes public information. And having public information is *not* illegal.

There are sites and forums where you can get these leaks for free, generally by participating in the forum discussions, earning credits, and then spending those credits to unlock download links to the data breaches/leaks.

While I'm *somewhat* okay with all this sensitive data being available to the public, I'm not going to say where these places are, as raising awareness of where you can go to download this data would be a dangerous move for me. People on these sites don't like it when someone tells everyone about their site, and also, more awareness tends to lead to more abuse of this information.

## Using your Data

To collect and use all this data, you'll also need somewhere to store it. Right now, I'm using a 4TB external HDD to store my live database; although, it's had some issues, and it isn't the most reliable drive. It might just be a defect or the result of me buying an HDD on the cheap side, but the important thing to note here is that I can't rely on the drive completely. There was an instance where the drive became read-only, and my Mac couldn't repair the disk without wiping it. Thanks to Google giving unlimited storage to .edu domains, I was able to back all of the data up to the cloud. Then, about a month later (I hadn't wiped the drive yet), it suddenly started working again. Honestly, I'm not sure if that's a good thing or a bad thing.

Enough about my bad experience with this hard drive, the point is, that if you want to collect and horde data, make sure your storage won't fail you. It'd suck to have spent several months collecting multiple terabytes of data dumps only for the hard drive to fail and to lose everything.

And if you're extremely concerned about losing data, consider getting a RAID. It's basically a way to keep your data on multiple drives. And with a raid, if one of the drives fails, you still have other drives to recover from.

Ok, so once you've got your data, you'll need a way to search through it. A lot of people like to use **Grep**, which is a command-line utility that lets you search for text. Grep is great for reading a file and searching for specific things in that file, but when it comes to trying to find info in terabytes of leaked data, you'll find it rather slow. Ripgrep is a much better alternative; it's the same thing, but more optimized for speed. So, Grep and Ripgrep are good for their ease of use. But, again, when searching through a lot of data, they won't be the fastest. Having a live database that can handle *billions* of records would be much more preferable if you're aiming for speed. And that's what I've been doing, for the most part.

Lots of people like to use SQL, which is fine, although MongoDB has been said to be faster than SQL, better optimized for large datasets, and it can handle more advanced types of documents. And, because of that, I prefer MongoDB, and have a program designed for searching through multiple databases. There's a few problems with using a database rather than grepping a bunch of files though. As I said, Grep is the easiest method, since it's just a text search program. Having a database means you need a way to import all of your data, which isn't always easy.

When leaked data gets published online, it's often a zip file filled with a bunch of text files, usually from different contributors. This leads to many problems. Sometimes you'll get a bunch of data, but no headers (labels) for the columns. This means you'll have to look through and try to determine what each column is, which is a pain when trying to do this for hundreds of leaks.

Also, the consistency of the data structure may vary, and this is largely a result of having multiple contributors bundled into one leak. Sometimes I'll try to parse a combo list, where the data looks like
```
username:password
```
but halfway through the file, the format becomes
```
username;password
```
which makes it difficult to parse through, which is why most people prefer to use grep. And if you haven't done much programming, it might be better to stick to Grep, since parsing through these files will generally require custom scripts to do things properly.


## Conclusion

The whole point of this, really, was just to provide some insight as to how an individual can do background checks on someone without paying money to a data broker. And, by the way, relying soley on data breaches and leaks as a means to get information about someone isn't a good idea. Often times, information with the same or more value to an investigation can be found by using Google and other online tools. 

But the whole reason for collecting this data is to make things quicker, and more automatic.
Oh, and about automating it; I recently wrote a program, designed to make this a lot easier. It's still in development, but essentially, it lets you perform a query on multiple databases, even if these databases have different schemas. It's free and open source, so feel free to <a target="_blank" href='https://github.com/TrevorBagels/leakscoop'>check it out</a>.


## *A quick note*

After reading this, you might think "oh man this guy's a stalker or something."

And actually, I'm hoping that that'll be where my carreer takes me. Professional stalking. Well, no, I wouldn't call it stalking, because stalking generally goes on for a long period of time, and there actually are "professional" stalkers that physically follow a target around for money and take photos of them, and quite frankly, I find those kind of people to be creepy. I'm leaning on the side of something like a private investigator. And stuff like this is quite fun, so fun that people will pay money just to do it for fun. Take <a href="https://www.tracelabs.org/" target="_blank">TraceLabs</a> for example, an event where a bunch of people form teams, and help find missing people. (tickets to participate in a TraceLabs CTF cost money, and they've already reached full capacity for their next event.)