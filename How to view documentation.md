# How to run
Double-click `Serve_Website.bat`. This will automatically fire up a local website.


# Dcoumentation!!!
This is where all my documation on a project basis will live.

### The Scoup:
  - I fucking hate Word. It's so limited, and the formulas are trash
  - Excel is great. . . for calculators but nothing else
  - Markdown is fantabulous, but you can't build calculators into markdown which is sad
### Zensical?
Zensical is the "material" people's breakoff of mkdocs. It takes your markdown and converts it into a webpage that you can view. **That's super sick!**

I tried buiding a webpage with hmtl, but html is so damn verbose it's farking awful. I'm not trying to learn that right now.

With zensical, we can use markdown to generate beautiful documentation, and we can also run javascript in it. This means we can make calculators and stuff. 


# Other ways to run

There are 3 main ways to view this webpage. 

### 1 - Host on Github.io
This is the cleanest way. . . it would literally just be a webpage that you visit. This is what I originally wanted to do, but it has to be public unless you pay for github. Sad. We can't exactly make this public, so sorry.

### 2 - Open the boring way
Open the `site` folder. Each page on the site will have its own folder, i.e. "Rack_Pinion_Calc". Open that folder and open the `.html` file. This will allow you to statically view that singular page. **The navigational links will NOT work.**

### 4 - Run with Zensical
This isn't nearly as hard as you'd think. 

1. Open the directory and RMC -> Open in Terminal
2. Bash `zensical serve`
3. Click on the link given `http://localhost:8000`

The webpage is now live. Any changes you make to the file will be updated in real time. 

# How to STOP Zensical
If the webpage crashes due to some error, sometimes Zensical fail in the terminal. Then when you go to open the website again with `Start Website.bat`, it says that the port is already open. Do this:
1. Close all browser instances of the website
2. Run `Stop Website.bat`
3. Wait a second and then re-open `Start Website.bat`


The `Serve_Website.bat` is simply running the steps above. In this same folder is a dot bat guide that explains how it works. 




