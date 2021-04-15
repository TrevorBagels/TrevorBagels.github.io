# TrevorBagels.github.io
Personal website

Might as well explain how I did this, to those who are curious. There's this handy thing called [Jekyll](https://jekyllrb.com/), and I used it to slap this site together.

If you take a look at `_layouts/default.html`, you'll see what looks like an empty web page. You'll also see these weird lookin `{% include %}` tags. 
Basically, Jekyll compiles your entire site into a static site, and those include tags are telling Jekyll what to do/how to build the site. 
`{% include %}` just shortens the amount of work I have to do, by telling Jekyll to place html from a file in `/_include/` into whatever files have the `{% include %}` tags.

Then, if you take a look at index.html, you'll see some yaml stuff at the top, surrounded by `---`. That's just telling Jekyll what layout from /_layouts/ to use, as well as the title of the page, and other variables for that page that I can set up later. Within index.html, you might see some {% for %} loops. Yeah, I can use for loops to automatically build out parts of my site. Something like 

```liquid
<ul>
    {% for song in site.data.songs $%} 
      <li> {{song.name}} </li> 
    {% endfor $%}
</ul>
```

will create a list of all the songs in my site data, which is located in several json files under `/_data/`. 
Pretty neat. And no, Jekyll didn't sponsor this readme, but I do recommend looking into Jekyll if you're a programmer and want to make your static sites more efficient. 
