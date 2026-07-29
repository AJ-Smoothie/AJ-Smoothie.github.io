This short guide will show you how to assign a USB device to a port - kinda. It doesn't seem like you can exactly lock down the ports, but what you can do is assign a name (alias if you will) to a particular device. Then instead of using `/dev/ttyUSB0` you could use `/dev/<MY_DEVICE_NAME>`.

1. Plug in just the device you're interested in
2. Bash `dmesg | tail -20` this will show the names and information of your devices. You are looking for idVendor & idProduct.
    * `idVendor=1a86`
    * `idProduct=7523`
3. Create a new rules file. Use a higher number so that the other more important rules happen first `sudo nano /etc/udev/rules.d/99-usb-serial.rules`. Add in the correct vendor & product numbers: `SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", SYMLINK+="<DEVNAME>"`
4. `CTRL+X`, `Y`, `Enter` to save
5. `sudo udevadm control --reload-rules` & `sudo udevadm trigger` to reset.
6. Check the name you just setup: `ls -l /dev/<DEVNAME>` and it should point to the correct port.

**To show USB devices**
`ls -l /dev/serial/by-id/` or 

 