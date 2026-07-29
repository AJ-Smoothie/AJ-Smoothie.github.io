```
#include <thread>
#include "serial/readTerminal.cpp"
  readTerminal terminal;
#include "serial/usbserial.h"
   USB_Serial arduino("/dev/ttyASA", B115200);

   //g++ test.cpp -o test

int main()
{
  terminal.init();
  if (arduino.init()) std::cout << "Arduino init!" << std::endl;
  
  while (true)
    {
       std::string msg;
       if (arduino.get(msg)) std::cout << msg;
       // terminal returns chars, we need to convert to strings for send()
       char c = terminal.get();
       if(c == 'z') break; // break out of the program
       //std::string str = std::string(1, c);
       arduino.send(std::string(1, c));
       std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }

  std::cout << "Exiting Program. . ." << std::endl;
  
  terminal.end();
  arduino.closePort();
  return 0;
}
```