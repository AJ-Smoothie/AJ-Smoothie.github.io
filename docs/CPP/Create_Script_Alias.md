1. Open your shell configuration file: `nano ~/.bashrc`
2. Scroll the the bottom, and add an alias line: `alias aliasName= path-to-script.sh`
   - E.g. `alias beans='~/Desktop/XT7_RT/scripts/beans.sh'`
3. `Ctrl+O`, `Enter`, & `CTRL+X` to save and exit. 
4. Reload the shell config: `source ~/.bashrc`
5. To run, simply type the name of the alias. 

## The script:

```
#!/bin/bash

cd /home/ajrob/Desktop/XT7_RT/build
cmake ..
make
sudo ./main

# Make it executable
# chmod +x ~/Desktop/XT7_RT/scripts/beans.sh
# Then make it a global alias. We are going to add it in ~/.bashrc
# nano ~/.bashrc
# We go to the bottoma and add the following line
# alias beans='~/Desktop/XT7_RT/scripts/beans.sh
# Save and refresh with:
# source ~/.bashrc
```