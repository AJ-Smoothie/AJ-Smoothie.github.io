---
icon: material/code-braces
---

# VS Code Clangd Setup

Fucking finally! A process that is repeatable to setup vscode with clangd!

1. Install GCC via MSYS2. You'll need to add it to path: `C:\msys64\ucrt64\bin`
2. It's pretty much works out of the box with VScode. You'll just need to click on the `Run` button and select the `G++` compiler option
3. Install the **Clangd** extension fully. Let it disable intellisense
4. Navigate to `C:\Users\<username_here>\AppData\Local` and create a folder `clangd` and cd into it
5. Inside create a file called `config.yaml` and pop in the following contents:
    ``` yaml
    CompileFlags:
      Compiler: C:/msys64/ucrt64/bin/g++.exe
      Add: [-std=c++23, -Wall]
    ```
6. Restart language server and voila!!! Hells yeah!