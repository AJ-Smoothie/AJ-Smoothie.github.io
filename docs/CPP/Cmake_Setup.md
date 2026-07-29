# 🛠 Setting up CMake Doesn't Have to Be Hard!

In the folder that houses your (main) `test.cpp`, create a file called `CMakeLists.txt` and copy the following into it:

```cmake
cmake_minimum_required(VERSION 3.10)
project(test)

set(CMAKE_CXX_STANDARD 17)

# Define a source root
set(SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../src)

# Include headers
include_directories(${SRC_DIR})

# Add the executable
add_executable(test
    test.cpp
    ${SRC_DIR}/serial/readTerminal.cpp
    ${SRC_DIR}/serial/usbserial.cpp
)

# Link system libs and static archive
target_link_libraries(test
    modbus
    pthread
    ${SRC_DIR}/synergy/libsynergy.a
)
```

---

## Line-by-Line Explanation

- `cmake_minimum_required(VERSION 3.10)`  
  Ensures you're using at least version 3.10 of CMake.

- `project(test)`  
  Names your project. It can be anything.

- `set(CMAKE_CXX_STANDARD 17)`  
  Forces the compiler to use C++17 standard.

- `set(SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../src)`  
  Defines a reusable variable `SRC_DIR` that points one level up to your `src/` directory.

- `include_directories(${SRC_DIR})`  
  Adds all subfolders inside `src/` to your include path so your `#include "serial/usbserial.h"` style headers resolve.

- `add_executable(test ...)`  
  This tells CMake to build an executable called `test` using the listed `.cpp` files.

- `${SRC_DIR}/serial/readTerminal.cpp` and `${SRC_DIR}/serial/usbserial.cpp`  
  These are source files outside the local folder — pulled in for compilation.

- `target_link_libraries(test ...)`  
  Links your `test` binary against:
  - `modbus`: for Modbus communication
  - `pthread`: for POSIX threading
  - `${SRC_DIR}/synergy/libsynergy.a`: your in-house static library

---

## 🚀 Build & Run

Make a `build/` folder if it doesn’t exist: `mkdir -p build` and `cd build` into it

```bash
cmake ..
make
./test
```

- `cmake ..` makes all the cmake files into the current folder
- `build` actually compiles everything down into an executable file

> You cannot use ~/Desktop etc in CMake. Yep I know. Use the full path

In VScode make sure that you have a c_cpp_properties.json setup. It should look something like this:

```
{
    "configurations": [
        {
            "name": "Linux",
            "includePath": [
                "${workspaceFolder}/**",
                "${workspaceFolder}/../XT7_RT/src"
            ],
            "defines": [],
            "compilerPath": "/usr/bin/gcc",
            "cStandard": "c11",
            "cppStandard": "c++17",
            "intelliSenseMode": "linux-gcc-arm"
        }
    ],
    "version": 4
}
```
> The recursive search for intellesense doesn't usually work? `"${workspaceFolder}/../XT7_RT/src"` manually directs it to the right place so that your .h includes work.
