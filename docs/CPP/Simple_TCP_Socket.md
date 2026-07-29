# 🖥️ Minimal Threaded TCP Command Server in C++ (Pattern #2: Non-Blocking Poll)

This implementation follows **Pattern #2: Non-Blocking Poll**, meaning:
- The **server thread** handles all socket I/O and assembles incoming lines.
- The **main thread** periodically polls for new commands via `getCommand()`.
- There is **no blocking** in main; it can keep doing other work between polls.
- This design keeps hardware (like motors) owned and controlled entirely by **main**, avoiding thread-safety issues.

---

## 📂 File Structure
```
CommandServer.h
CommandServer.cpp
main.cpp
```

---

## CommandServer.h
```cpp
#pragma once
#include <string>
#include <thread>
#include <atomic>
#include <mutex>
#include <queue>
#include <cstdint>

class CommandServer {
public:
  explicit CommandServer(uint16_t port = 9000,
                         uint32_t addr = 0x7F000001 /* 127.0.0.1 */);
  ~CommandServer();

  void start();
  void stop();
  bool running() const { return on_.load(); }

  // Non-blocking: returns true if a command was available and put into out
  bool getCommand(std::string& out);

private:
  void run();

  int srv_ = -1;
  std::thread th_;
  std::atomic<bool> on_{false};

  // where the server thread drops complete lines for main to consume
  std::mutex mtx_;
  std::queue<std::string> q_;

  uint16_t port_;
  uint32_t addr_;
};
```

---

## CommandServer.cpp
```cpp
#include "CommandServer.h"

#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>
#include <iostream>

CommandServer::CommandServer(uint16_t port, uint32_t addr)
  : port_(port), addr_(addr) {}

CommandServer::~CommandServer() { stop(); }

void CommandServer::start() {
  if (on_.exchange(true)) return;   // already running
  th_ = std::thread(&CommandServer::run, this);
}

void CommandServer::stop() {
  if (!on_.exchange(false)) return;
  if (srv_ >= 0) {
    ::shutdown(srv_, SHUT_RDWR);
    ::close(srv_);
    srv_ = -1;
  }
  if (th_.joinable()) th_.join();

  // optional: clear queue on stop
  std::lock_guard<std::mutex> lk(mtx_);
  std::queue<std::string> empty; std::swap(q_, empty);
}

bool CommandServer::getCommand(std::string& out) {
  std::lock_guard<std::mutex> lk(mtx_);
  if (q_.empty()) return false;
  out = std::move(q_.front());
  q_.pop();
  return true;
}

void CommandServer::run() {
  srv_ = ::socket(AF_INET, SOCK_STREAM, 0);
  if (srv_ < 0) { perror("socket"); on_ = false; return; }

  int one = 1;
  ::setsockopt(srv_, SOL_SOCKET, SO_REUSEADDR, &one, sizeof(one));

  sockaddr_in a{};
  a.sin_family = AF_INET;
  a.sin_port   = htons(port_);
  a.sin_addr.s_addr = htonl(addr_);

  if (::bind(srv_, (sockaddr*)&a, sizeof(a)) < 0 || ::listen(srv_, 1) < 0) {
    perror("bind/listen");
    ::close(srv_); srv_ = -1; on_ = false; return;
  }

  while (on_) {
    int cli = ::accept(srv_, nullptr, nullptr);
    if (cli < 0) {
      if (on_) perror("accept");
      continue;
    }

    std::string buf, line;
    char tmp[1024];

    // read bytes, split on '\n', enqueue lines
    for (ssize_t n; on_ && (n = ::recv(cli, tmp, sizeof(tmp), 0)) > 0; ) {
      buf.append(tmp, tmp + n);
      size_t p;
      while ((p = buf.find('\n')) != std::string::npos) {
        line = buf.substr(0, p);
        if (!line.empty() && line.back() == '\r') line.pop_back();

        {
          std::lock_guard<std::mutex> lk(mtx_);
          q_.push(line);
        }

        buf.erase(0, p + 1);
      }
    }
    ::close(cli);
  }

  if (srv_ >= 0) { ::close(srv_); srv_ = -1; }
}
```

---

## main.cpp (Example Usage)
```cpp
#include "CommandServer.h"
#include <iostream>
#include <chrono>
#include <thread>

int main() {
  CommandServer srv; 
  srv.start();

  while (srv.running()) {
    // Do other main-thread tasks here
    // updateDisplay();
    // checkSensors();

    std::string cmd;
    if (srv.getCommand(cmd)) {  // Non-blocking check
      std::cout << "MAIN GOT: [" << cmd << "]\n";
      if (cmd == "beans") {
        std::cout << "-> handling beans\n";
      }
      if (cmd == "quit") {
        std::cout << "stopping\n";
        srv.stop();
      }
    } else {
      std::this_thread::sleep_for(std::chrono::milliseconds(5)); // tiny poll delay
    }
  }
}
```

---

## 🔌 Connecting from Terminal

**From same machine:**
```bash
nc 127.0.0.1 9000
```
Type a line, press **Enter** → It will show up in `main()`.

**From another machine:**
- Change `addr` in `CommandServer` constructor to `INADDR_ANY`
- Connect with:
```bash
nc <server-ip> 9000
```

---

## 🛠️ Build Command
```bash
g++ main.cpp CommandServer.cpp -lpthread -o server
```

---

## Key Points of Pattern #2
- **Non-blocking**: `main` is never forced to wait for a command.
- **Safe hardware control**: all hardware logic stays in main thread.
- **Thread-safe queue**: server and main communicate only via the protected queue.
- **Polling is fine**: Even if you wanted “instant” response, the server still assembles messages in its own loop, so a few microseconds of polling delay in main is negligible.

---

## Possible Enhancements
- Use `std::condition_variable` to block until a command arrives (switch to blocking mode if needed)
- Support multiple simultaneous clients
- Add server-to-client message sending
