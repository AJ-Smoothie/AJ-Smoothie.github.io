# C++ Linkage, Constants, and Declarations Cheat Sheet

This document is a **mental reset button** for when C++ linkage rules fall out of your head (they will).
Keep this nearby when working with headers, CMake projects, and embedded systems.

---

## 🔗 Linkage (The Core Concept)

**Linkage** answers this question:

> *When the linker sees a name, does it refer to the same thing across translation units?*

### Types of Linkage

| Type | Meaning |
|-----|--------|
| **Internal linkage** | Each `.cpp` gets its own copy |
| **External linkage** | One shared symbol across all `.cpp`s |
| **No linkage** | Exists only in its local scope |

---

## 📜 The One Definition Rule (ODR)

**ODR Rule:**
> A symbol with **external linkage** must have **exactly one definition** in the entire program.

Violating this causes:
```
multiple definition of ...
```

Headers are included into **multiple translation units**, so definitions in headers must be chosen carefully.

---

## `const`

```cpp
const int PIN = 5;
```

### Key Facts
- At **namespace scope**, `const` has **internal linkage**
- Safe to define in headers
- Each `.cpp` gets its own copy

### Use When
- Value is constant
- You don’t need a single shared instance

### Notes
- May still allocate storage
- Not always usable in compile-time contexts

---

## `constexpr` ⭐ (Preferred for constants)

```cpp
constexpr int PIN = 5;
```

### Key Facts
- **Internal linkage by default**
- Compile-time constant
- No storage unless needed
- Header-safe

### Use When
- Pins
- Array sizes
- Template parameters
- Anything that should never change

👉 **This should be your default choice**

---

## `inline` variables (C++17+)

```cpp
inline int counter = 0;
inline const int PIN = 5;
```

### Key Facts
- **External linkage**
- Allowed to appear in multiple translation units
- Linker merges them into one

### Use When
- You want a single shared variable
- Defined in a header
- Global state is intentional

⚠️ Overuse = global-state hell

---

## `extern`

### Header (Declaration Only)
```cpp
extern int counter;
```

### ONE `.cpp` (Definition)
```cpp
int counter = 0;
```

### Key Facts
- Declares a symbol that exists elsewhere
- Definition must appear exactly once
- Classic C-style global sharing

### Use When
- Variable must be mutable (mutable = can change at runtime)
- Single shared instance is required
- Hardware state, global system flags

---

## Forward Declarations with `extern`

```cpp
// header.h
extern int systemState;
```

```cpp
// system.cpp
int systemState = 3;
```

Other `.cpp` files:
```cpp
#include "header.h"
// use systemState
```

This avoids multiple definitions while allowing global access.

---

## `enum` / `enum class` (Zero-linkage constants)

```cpp
enum {
    PIN_A = 1,
    PIN_B = 2
};
```

```cpp
enum class Pin : int {
    A = 1,
    B = 2
};
```

### Key Facts
- No storage
- No linkage
- Impossible to violate ODR

### Use When
- Pin numbers
- States
- Identifiers

🔥 **Extremely safe and clean**

---

## ❌ What NOT to Put in Headers

```cpp
int counter = 0;   // ❌ multiple definition error
```

```cpp
static int counter = 0; // ❌ works, but hides bugs
```

```cpp
#define PIN 5 // ❌ no type, no scope, no debugger info
```

---

## 🧠 Mental Cheat Rules

- **Headers may declare, not define (unless constexpr / inline)**
- **`constexpr` for constants**
- **`extern` for shared mutable data**
- **`inline` for header-defined shared variables**
- **Enums are safest when possible**
- **If the linker yells → ODR violation**

---

## Recommended Default Choices

| Scenario | Use |
|------|-----|
| Pin numbers | `constexpr` or `enum class` |
| Global mutable state | `extern` |
| Header-only shared variable | `inline` |
| Compile-time value | `constexpr` |
| Never want linker issues | `enum` |

---

**Miranda-approved** ✔  
If this rulebook feels annoying, that means you’re doing real C++.

---

## `inline` vs `extern` Variables (Direct Comparison)

Both `inline` and `extern` create **one shared variable** across all `.cpp` files.
The difference is **where and how the definition exists**.

### Side-by-Side Comparison

| Feature | `extern` | `inline` (C++17+) |
|------|--------|------------------|
| Definition location | Exactly ONE `.cpp` | In the header |
| Header contains | Declaration only | Full definition |
| Storage | One shared instance | One shared instance |
| ODR-safe | Yes (if done correctly) | Yes (guaranteed) |
| Requires `.cpp` file | ✅ Yes | ❌ No |
| Style | Traditional / explicit | Modern / header-only |
| Best for | Core system state | Small shared utilities |

---

### `extern` Example (Explicit Ownership)

```cpp
// system_state.h
#pragma once
extern int systemState;
```

```cpp
// system_state.cpp
#include "system_state.h"
int systemState = 0;
```

```cpp
// any.cpp
systemState++;
```

**Mental model:**  
> “This variable lives in exactly one place. Everyone else references it.”

---

### `inline` Example (Header-Only)

```cpp
// system_state.h
#pragma once
inline int systemState = 0;
```

```cpp
// any.cpp
systemState++;
```

**Mental model:**  
> “This variable is defined everywhere, but the linker merges it into one.”

---

### Choosing Between Them

| Situation | Use |
|--------|-----|
| Global system state | `extern` |
| Hardware / machine mode | `extern` |
| Header-only library | `inline` |
| Utility counters / flags | `inline` |
| If unsure | `extern` |

---

### Important Notes

- `inline` **does not** mean faster
- `inline` **does not** imply compile-time constant
- Both create **one shared object**
- Overusing either = global-state risk

---
