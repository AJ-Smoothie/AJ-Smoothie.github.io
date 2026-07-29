### Setup a script to upload to the Arduino

1. Create a new folder and a sketch.ino. **Remember, the folder name must match the sketch name!**
2. Create a script file named something like `jbus.sh`
3. Populate with the following:
```
PORT="/dev/ttyASA"
SKETCH_DIR="/home/ajrob/Desktop/XT7_RT/XT7_Arduino/Jbus_A"
BUILD_DIR="/home/ajrob/Desktop/XT7_RT/XT7_Arduino/Jbus_A/build"
FQBN="arduino:avr:nano"

# Compile
arduino-cli compile --fqbn $FQBN --build-path $BUILD_DIR $SKETCH_DIR

# Upload
arduino-cli upload --fqbn $FQBN -p $PORT --input-dir $BUILD_DIR --verbose
```

### Make it executable
Make sure you cd into the proper directory containing your script file
`chmod +x jbus.sh`

### Run the script
In the proper directory, just bash: `./jbus.sh`

### Create an alias
1. `nano ~/.bashrc`
2. Scroll to the bottom of the file
3. add `alias aliasName='~/Desktop/Path/To/Script.sh'` e.g. `/home/ajrob/Desktop/XT7_RT/XT7_Arduino/Jbus_A/jbus.sh`
4. The following saves the file and reloads it
    - `Ctrl + O`
    - `Enter`
    - `Ctrl + X`
    - `source ~/.bashrc`
### Bash `scriptName` anytime to run the script