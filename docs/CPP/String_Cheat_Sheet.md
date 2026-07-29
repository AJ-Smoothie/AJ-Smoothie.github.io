## 📦 Construction / Initialization

```
std::string();                           // empty string
std::string("hello");                    // from C-string
std::string(5, 'A');                     // "AAAAA"
std::string(str);                        // copy another string
std::string(str, 0, 3);                  // substring constructor
std::string(ptr, len);                   // from raw buffer (can include '\0')
```
## 🔠 Access
```
s[i];                // char at index (no bounds check)
s.at(i);             // char at index (throws if out of range)
s.front();           // first character
s.back();            // last character
s.data();            // pointer to internal char buffer
s.c_str();           // null-terminated version (C-style)
```
## 📏 Size and Capacity
```
s.size();            // number of characters
s.length();          // same as size()
s.empty();           // true if empty
s.capacity();        // current allocated storage
s.resize(n);         // resize to n characters
s.reserve(n);        // pre-allocate capacity
s.shrink_to_fit();   // reduce capacity to size
```
## ✂️ Modification
```
s.clear();                      // erase all content
s += "world";                   // append
s.append("!!!");                // append string
s.append("xyz", 2);             // append 2 characters: "xy"
s.insert(2, "INSERT");          // insert at index
s.insert(2, 3, '*');            // insert 3 '*'s at index
s.erase(2, 3);                  // erase 3 chars from index 2
s.replace(0, 5, "Hello");       // replace first 5 chars
std::swap(s1, s2);              // swap contents with another string
```
## 🔍 Search
```
s.find("needle");               // first occurrence, or npos
s.rfind("needle");              // last occurrence
s.find("x", pos);               // start search at pos
s.find_first_of("abc");         // first match of any of those
s.find_last_of("abc");          // last match of any
s.find_first_not_of(" \n\t");   // skip whitespace
s.find_last_not_of("abc");      // from end
```
## 🧵 Substrings
```
s.substr(2);                    // from index 2 to end
s.substr(2, 4);                 // 4 characters starting at index 2
```
## 🔁 Comparison
```
s == "hello"                    // compare with C-string
s != otherString
s < otherString
s.compare("abc")               // -1, 0, or 1
s.compare(pos, len, otherStr)  // partial compare
```
## 🔢 Conversion
```
std::to_string(123);           // "123"
std::stoi("42");               // 42 (int)
std::stol("42");               // long
std::stof("3.14");             // float
std::stod("3.14");             // double
```
## ➕ Iterators
```
s.begin();                     // iterator to first char
s.end();                       // one-past-last
s.rbegin();                    // reverse iterator
s.rend();
```
### ⚙️ Utilities
```
std::getline(std::cin, s);     // read line of input into string
std::hash<std::string>()(s);   // get hash value
std::string::npos;             // special constant = not found
```
## 🔥 Nice to Know
```
for (char c : s) { ... }       // range-based loop
std::stringstream ss(s);       // treat as a stream
```