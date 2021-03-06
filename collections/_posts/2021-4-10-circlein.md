---
layout: post
title:  "100 Million Points in Fifteen Minutes"
desc: "Exploiting a vulnerability, becoming rich, and then reporting it. I was responsible, for the most part."
tags: ["hacking?"]
---


## Introduction
A couple weeks ago, a student at my university was talking about this application called <a target="_blank" href="https://circleinapp.com">CircleIn</a>, an app for task management, note-taking and note sharing, and overall productivity-boosting for things related to education. What this person was talking about, however, was the fact that they obtained **two million points in a single day**. For context, people don't usually exceed 1 million points in any given month. In fact, the average, as far as people at my university go, is about 72.9K points, if you're in on the top 100 of the leaderboard. Also, the points for each person resets at the end of each month.

So how'd they do it? 

Well, the method is quite simple, actually. CircleIn gives a user 1000 points for every task that they create. This means, that if one were to create 1 task every second, they'd have about 60K points in a minute. 600K points in ten minutes. 3.6 million points in an hour. After about one minute though, it becomes a waste of time. And after more than 1000 tasks, the rate in which you create these tasks falls very low, due to browser lag. 

So, two million points, eh? It's sort of a large amount, but in comparison to all the others, it was only about four times some of the other high scores (~500K points). Why not go bigger? Ok, maybe it's a waste of time. Unless we go bigger in a way that won't be wasting any time.

## Gaming the System

I was curious if the people at CircleIn had thought about this already, and whether or not they had implemented systems to prevent people from gaining massive amounts of points like this. A few weeks ago, I wrote a program to attack sites trying to collect IP address data (trackers in your email, IP loggers, etc.) The way this program works is by connecting to the site via proxies. Initially, the program was extremely slow, because routing network traffic through a free proxy can result in wait times **as long as 2 minutes**. I got around this obstacle with multithreading, where instead of doing each request one by one, the program would make several requests, each on their own thread, preventing one really slow proxy from slowing down the entire program. Read more about that <a href="/2021/04/01/multithreadedproxies" target="_blank">here</a>.

So I took this program, and retrofitted it, so that instead of sending a request via proxy to some URL I despise, it would make API calls, telling CircleIn to create a task on my account. Because it was no longer going through proxies, the program was much faster. And because there wasn't any browser involved, there wasn't any lag. So, just how many tasks was I making per second? Just a little under 50 per second. I could've moved the program to a beefier machine, like my desktop, and I probably would've gotten a rate of 100-200 requests per second. I could have run the program on all of my devices, and combined their power. But let's stick to what I can confirm. About 50 requests per second, on my 7-year-old MacBook Pro. That would be a whopping (60 * 60 * 50 * 1K) 180 million points in a single hour, which is about 4.3 billion points in 24 hours.

So, I ran the program. Then I realized, I'll probably get rate-limited by something like Cloudflare, right? Almost every site I've seen uses Cloudflare, I'd expect this one to use it too. So I sat back, and I let the program continue to run. 500 requests, all responses giving code 200s (which means I'm not being rate-limited yet). 1000. Still getting response 200s. 5000. I check in a few minutes later. Ten thousand requests, all with response code 200. I'm over a million points already. 

Normally, something like this would fail, and get rate-limited. For those who aren't aware of what rate-limiting is, it's when a host prevents you from accessing their site or certain parts of their site if you're trying to access it too fast. Without rate-limiting, a site becomes susceptible to DoS (denial of service) attacks and spam. At some point, while writing this article, I'll have to check to see if they've implemented rate-limiting. Honestly, it'll be a relief for me if they haven't, as I have 100K tasks that I need to delete (still), and rate-limiting will certainly slow that process down. 

## Conclusion

I suppose now is when I'll say, I had no nefarious means when doing this. It was mostly out of curiosity and for fun. Oh, and people with over 200K points get selected to be part of monthly giveaways, where CircleIn gives out free gift cards. I <span title="i did, actually. I wouldn't have accepted any rewards though.">totally didn't know that when I was doing this.</span>

So, in the end, I racked up 100 million points. It was also pretty late at night and I was getting tired, so I didn't continue exploring to see what else I could mess with. Instead, I checked my school email and found the email that CircleIn emailed me when I signed up on that day. Down at the bottom, there was an option to schedule a meeting with their design team. I saw this and realized it'd be a great way to report the vulnerability. I mean, if you send an email to an organization, informing them of a flaw, and a single person reads it, they're much more likely to dismiss it as unimportant, move on, and leave that flaw unattended. On the other hand, if an entire group of people see and read it, it'll be taken much more seriously. So I scheduled a meeting with the design team for the next available time window, and we had a chat about the exploit the next day.

So, I talked with their design team, and they seemed to take the issue somewhat seriously, for they passed it on to their development team. Also, turns out they had received an email from someone else, probably someone attending the same university, looking at the leaderboard, and seeing me up at the top with a hundred million points. It was actually a report, about how I seemed suspicious, having so many points. I also asked them about the giveaways, and apparently, they manually review every selected winner before sending out the gift cards. So, had I won something, they would've seen my 100 million points, taken a look at my tasks, and found that my tasks were full of gibberish; they would have just skipped me and rerolled the giveaway. 
There is one thing I forgot to ask them though, and I'm pretty bummed I forgot to ask this: was I at the top of the global leaderboard? Oh well, I guess I'll never know. Now, I'm gonna go and test their systems again for rate-limiting.

As of May 17th, 2021, they still haven't implemented any rate-limiting. 

<img class='large-img zoomable' src='/assets/images/blog/addratelimiting.png'>