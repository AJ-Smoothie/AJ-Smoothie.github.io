# 🧠 AVR C-String Cheat Sheet

These functions come from `<string.h>` and `<stdlib.h>`, perfect for AVR platforms like the Arduino Uno, Nano, and Mega.


## ✨ Creating Strings

| Method | Example | Notes |
|--------|---------|-------|
| String literal | `const char* s = "Hello";` | Lives in flash/ROM, **read-only** |
| Fixed buffer init | `char buf[10] = "Hi";` | Stored in RAM, auto null-terminated |
| Empty buffer | `char buf[32] = {0};` | Zero-initialized, safe for writing later |
| Manual fill | `char buf[6]; buf[0] = 'H'; buf[1] = 'i'; buf[2] = '\0';` | Build char by char |
| From number | `char buf[6]; utoa(123, buf, 10);` | Converts number → string |
| Safe formatting | `char buf[16]; snprintf(buf, sizeof(buf), "X=%d", 42);` | Preferred for dynamic strings |

⚠️ Always ensure you leave room for the `'\0'` terminator at the end!

---

## 🗂️ Arrays of Strings (C-style)

On AVR we don’t have `std::vector<std::string>`. Instead we use **2D char arrays** (mutable) or **arrays of pointers** (read-only).

### 1. 2D Char Array (mutable strings)

```cpp
#define MAX_STRINGS 4
#define MAX_LEN     16

char words[MAX_STRINGS][MAX_LEN] = {
  "Hello",
  "World",
  "Beans",
  "Bark"
};

for (int i = 0; i < MAX_STRINGS; i++) {
  Serial.println(words[i]);
}
```



## 📋 Basic String Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `strlen(s)` | Get length up to `\0` | `int len = strlen("Hello");` → `5` |
| `strcpy(dst, src)` | Copy string | `strcpy(buf, "Hi");` |
| `strncpy(dst, src, n)` | Copy up to `n` chars | `strncpy(buf, src, 5);` |
| `strcat(dst, src)` | Append `src` to `dst` | `strcat(buf, "World");` |
| `strncat(dst, src, n)` | Append `n` chars | Safer than `strcat` |
| `strcmp(a, b)` | Compare strings | `strcmp("a", "b") == 0` if equal |
| `strncmp(a, b, n)` | Compare first `n` chars | Use for prefixes |

## 🔎 Search & Scan

| Function | Purpose | Example |
|----------|---------|---------|
| `strchr(s, c)` | First occurrence of char `c` | `strchr("foo", 'o')` |
| `strrchr(s, c)` | Last occurrence of `c` | |
| `strstr(s, sub)` | Find substring | `strstr("beans", "an")` |

These functions return a pointer to the first match. See the following example to use as index:
```
const char* msg = "Hello World";
const char* ptr = strchr(msg, 'W');  // points to 'W' in "World"
int index = ptr - msg;  // Gives you the index of 'W' (which is 6)
```

## 🧪 Memory Helpers

| Function | Purpose | Example |
|----------|---------|---------|
| `memcpy(dst, src, n)` | Copy `n` bytes | `memcpy(buf, src, 10);` |
| `memcmp(a, b, n)` | Compare `n` bytes | `memcmp(a, b, 10);` |
| `memset(s, v, n)` | Fill memory | `memset(buf, 0, 10);` |

## 🧮 Conversions

| Function | Purpose | Example |
|----------|---------|---------|
| `atoi(s)` | Decimal string → `int` | `atoi("42")` → `42` |
| `atol(s)` | Decimal string → `long` | `atol("12345")` → `12345L` |
| `atof(s)` | Decimal string → `float/double` | `atof("3.14")` → `3.14` |
| `strtol(s, end, base)` | String → `long` with base (2–36) | `strtol("1A", nullptr, 16)` → `26` |
| `strtoul(s, end, base)` | String → `unsigned long` | `strtoul("FF", nullptr, 16)` → `255` |
| `strtod(s, end)` | String → `double` (supports decimals/exponent) | `strtod("2.5e2", nullptr)` → `250.0` |
| `itoa(i, buf, base)` | `int` → string (base 2–36) | `itoa(255, buf, 10)` → `"255"` |
| `utoa(u, buf, base)` | `unsigned int` → string | `utoa(42, buf, 10)` → `"42"` |
| `ltoa(l, buf, base)` | `long` → string | `ltoa(1024, buf, 16)` → `"400"` |
| `ultoa(ul, buf, base)` | `unsigned long` → string | `ultoa(65535, buf, 10)` → `"65535"` |
| `dtostrf(f, width, prec, buf)` | `double/float` → string with formatting | `dtostrf(3.1415, 6, 2, buf)` → `"  3.14"` |
| `sprintf(buf, fmt, ...)` | Format data into string (⚠ unsafe, may overflow buffer) | `sprintf(buf, "%d", x);` |
| `snprintf(buf, size, fmt, ...)` | Safe version of `sprintf` with size limit | `snprintf(buf, sizeof(buf), "%04X", 255)` → `"00FF"` |

### Notes
- `itoa`, `utoa`, `ltoa`, `ultoa`, `dtostrf` are Arduino-friendly helpers not always present in plain C.
- Always prefer `snprintf` over `sprintf` to avoid buffer overflow.
- `end` in `strtol`, `strtoul`, `strtod` can be a pointer to get where parsing stopped. Use `nullptr` if you don’t care.


## ⚠️ Notes

- `strtok()` exists, but it **modifies** the input string and is not thread-safe.
- Use `strncpy` and `strncat` instead of `strcpy`/`strcat` for safer code.
- Always ensure buffers are null-terminated!

---

These functions are lightweight, fast, and perfect for memory-constrained AVR microcontrollers.

---

# 🔄 String ↔ Char Conversions Cheat Sheet (C++ & C-style)

These conversions are useful when switching between `std::string`, `char`, and `const char*`, especially when interfacing between C++ and C libraries or microcontroller code.

## 🔄 Conversion Table with Examples

| Task | Code | Example |
|------|------|---------|
| `char` to `std::string` | `std::string(1, c);` | `char c = 'A'; std::string s(1, c);  // s == "A"` |
| `std::string` to `char` (first character) | `char c = s[0];` | `std::string s = "Hi"; char c = s[0];  // c == 'H'` |
| `const char*` to `std::string` | `std::string(s);` | `const char* raw = "Hello"; std::string s(raw);` |
| `std::string` to `const char*` | `s.c_str();` | `std::string s = "USB"; const char* c = s.c_str();` |

## ⚠️ Notes

- `std::string(1, c)` creates a one-character string from any `char`
- `s[0]` accesses the first character — always make sure the string isn’t empty!
- `c_str()` returns a **read-only C-style string** — don't modify it
- To get a **modifiable** `char*`, use `strdup(s.c_str())`, but remember to `free()` it

---

These conversions are super common when writing C++ code for microcontrollers or low-level serial protocols.
