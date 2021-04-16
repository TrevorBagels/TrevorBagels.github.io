---
layout: post
title:  "Exploring Cyrillic"
desc: "Using Cyrillic to fingerprint text, impersonate online profiles, and encode secret messages in just about anything."
---

Back sometime in January, I stumbled across a Discord server for crypto pumping, which is market manipulation, but with cryptocurrency. I looked into it a little bit, got bored, and just forgot about it. I never left the server, and then I started getting random messages from people, either trying to invite me to their own pumping server, or trying to scam me with a cryptocurrency advancement fee scam. Believe it or not, this is the reason I've stayed in this server for as long as I have *(wasting the time of scammers is fun, and it's also fun to surprise people using botted user accounts, <span title="it's a fun trick with discord's API">joining the server they invite me to, and then telling them I know about their bots.</span>)* But I found one of the recruitment attempts quite facinating. You'll need some context for this, so I'll go ahead and give it.

The server I was part of is called Big Pump Signal, and its owner is *Dominus#8628*. His profile looks like this:

<img class='small-img zoomable' src='/assets/images/blog/cyrillic1.png'>

That's all the context you need.

In late February, I received a message from someone, trying to convince me that Big Pump Signal had a VIP server for "rich people".

<img class='medium-img zoomable' src='/assets/images/blog/cyrillic2.png'>

Obviously, this was just another attempt. Of course, I joined the server, just to see what it looked like on the inside. Then I saw that the owner of the server was a guy named Dοminuѕ. He also had the same profile picture. 

Great, that's gonna sell to like 10% of people on the internet, right? Then I clicked on his profile. It looked like this:

<img class='medium-img zoomable' src='/assets/images/blog/cyrillic3.png'>

Surely they couldn't be the same people, right? I copied both of their Discord IDs and compared them. The fake account had the ID `808321140585267219`, while the real one was `186516625946574848`. Well that was anticlimactic. But wait, how could the username *and* discriminator be the same? I copied both of the usernames, `Dοminuѕ#8628` and `Dominus#8628`, and compared them in Python. 

By the way, Python is super useful; if you don't know how to use it, I highly recommend learning. All I had to do to compare the usernames was open a terminal, run `python3`, then type 
```python
>>> "Dominus#8628" == "Dοminuѕ#8628"
False
```
And as you can see, the two names were not equal. I tried checking the length, in case the fake one had some kind of invisible character in it. They were the same length. So I wrote a quick loop in Python to determine the fake characters.

```python
>>> real = "Dominus#8628"
>>> fake = "Dοminuѕ#8628"
>>> for i in range(len(real)): print(real[i], fake[i], real[i] == fake[i])
D D True
o ο False
m m True
i i True
n n True
u u True
s ѕ False
# # True
8 8 True
6 6 True
2 2 True
8 8 True
```

So the `o` and the `s` are fake. So I started by Googling the fake letter "ο". A bunch of results about *Omicron*, the 15th letter of the Greek alphabet. So I tried searching "scοοp", because it was a random word that came to mind, that uses the letter "o". I replaced the "o"s with the fake "ο"s, and the first thing that shows up is something related to the English-Ukrainian dictionary. So it's one of those letters that gets used in the same alphabet that countries like Ukraine and Russia use. 

Simply Googling "What alphabet does the russian language use", makes it very clear that they use something called the Cyrillic alphabet. I noted that, and today, I decided to play around with it. I managed to find a <a target="_blank" href="https://www.unicode.org/charts/PDF/U0400.pdf">PDF documenting all the letters along with their unicode values</a>, found in the Cyrillic alphabet. I spent some time writing a <a target="_blank" href="https://github.com/TrevorBagels/CrypticCyrillic/blob/main/dictionary.json">list of key value pairs</a>, with the key being a normal letter, and the value being the Cyrillic version of that letter. Then, I wrote a program to covertly sign text with scattered Cyrillic letters. There's almost 30 Cyrillic variations of commonly used letters, including lowercase, uppercase, and accented characters. 

The program, in addition to sneaking Cyrillic into a bit of text, can also encrypt and decrypt secret messages. For this, it converts a secret message to binary. Then, it iterates through each character of the text. If the character can be turned to Cyrillic, it determines if it should do this by using the value in the binary version of the message, and checking whether it's 0 or 1. 

For instance,

your secret message is "a". I'm keeping it short because binary is kind of long.

"a" converts to 01100001

Now, let's go through this snippet of lorem ispum, 
```raw
Lorem ipsum dolor sit amet, consectetur adipiscing elit
```

We keep track of a variable, called `binary_index`, and then iterate through the lorem ispum.

**"o"** is the first letter that can be converted. The first index in our binary message is 0, which evaluates to `false`, so it won't get converted.
"**e**" is the second letter that can be converted, and the second index in our binary is 1, so the program converts "e" to "е". 

It goes on, but you should get the general idea. By doing this, it hides a binary value in the string, which can then be decrypted later on. 

If you'd like to take a look at the program that I wrote for this, check it out <a href="https://github.com/trevorbagels/CrypticCyrillic" target='_blank'>here</a>.

So that's cool, but hidden messages might not be enough. What else can we do with this?

Profile impersonation is one fun thing to do.
A few days ago, I found some random online chatting site, and started talking with random people on the internet (think Discord, but not as good.) Today, I impersonated someone there (that I had gotten to know a couple days earlier.) The guy, at first, thought his account was being hacked, because he saw messages in one of the open rooms, that looked as if they were coming from his account. I made it clear that I was impersonating him after I said "hello" to everybody in the room. I told everyone in the room that I wasn't actually him, and then I changed the profile picture to make it clear that it was a fake account. The profile picture was literally the word "FAKE." But that didn't seem to defuse the situation, and the guy ended up telling me he'd find where I live, kick down my door, and rip my hands off. Eventually though, he calmed down and said it was cool and all, and that he simply didn't like that there were two of him.

For the record, I didn't do anything nefarious with this fake account, in fact I contacted the people running the site and informed them about the risks of letting users choose usernames that go further than a-z and 0-9. Hopefully they'll do something about that. 

Also, I don't condone people abusing Cyrillic to impersonate accounts. A lot of harm can be done with it. That Discord server, that I was talking about earlier, had over 3,000 members. While some of those were probably bots, and some were likely people joining, just to join, I'm sure that a third of those people joined, and then *stayed*, because they fell for the fake account. And if you're a developer, setting up login/registration functionality, you might want to make sure to disable characters outside certain scopes, so that people don't impersonate each other with Cyrillic. Unless that's the selling point of your platform, of course.