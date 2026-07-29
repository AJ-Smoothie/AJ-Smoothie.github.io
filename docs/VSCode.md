---
icon: material/code-braces
---

# VS Code Clangd Setup

Fucking finally! A process that is repeatable to setup vscode with clangd!

1. Install GCC via MSYS2
2. Use it with VScode to get it working. You'll need to add it to path: `C:\msys64\ucrt64\bin`
3. Install the **Clangd** extension fully. Let it disable intellisense
4. Navigate to `C:\Users\<username_here>\AppData\Local` and create a folder `clangd` and cd into it
5. Inside create a file called `config.yaml` and pop in the following contents:
    ``` yaml
      Compiler: C:/mysys64/ucrt64/bin/g++.exe
      Add : [-std=c++23, -Wall]
    ```
6. Restart language server and voila!!! Hells yeah!