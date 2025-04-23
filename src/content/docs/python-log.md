---
title: Python 日志
---

在开发 Python 项目的过程中，`print()` 虽然简单直接，但并不适合生产环境。一个良好的日志系统不仅可以帮助我们排查 bug，还可以用于监控服务状态、记录系统行为等。Python 的标准库 `logging` 提供了强大而灵活的日志功能。本文将从基础讲起，一步步教你如何优雅地使用 `logging` 模块。

------

## 一、为什么使用 logging？

相比 `print()`，`logging` 有以下优势：

- 支持不同级别的日志（如 DEBUG、INFO、WARNING、ERROR、CRITICAL）
- 支持将日志输出到多个地方（控制台、文件、远程服务器）
- 可灵活配置输出格式
- 可按文件大小或时间轮转日志文件
- 可在大型项目中统一管理日志配置

------

## 二、快速上手：最简单的 logging 示例

```python
import logging

logging.basicConfig(level=logging.INFO)
logging.info("这是一个信息日志")
logging.warning("这是一个警告日志")
logging.error("这是一个错误日志")
```

输出示例：

```
INFO:root:这是一个信息日志
WARNING:root:这是一个警告日志
ERROR:root:这是一个错误日志
```

------

## 三、日志等级详解

`logging` 提供了 5 个等级的日志：

| 等级     | 方法                 | 说明                           |
| -------- | -------------------- | ------------------------------ |
| DEBUG    | `logging.debug()`    | 调试信息，开发时使用           |
| INFO     | `logging.info()`     | 一般信息                       |
| WARNING  | `logging.warning()`  | 警告信息                       |
| ERROR    | `logging.error()`    | 错误信息                       |
| CRITICAL | `logging.critical()` | 严重错误，程序可能无法继续运行 |

默认等级是 `WARNING`，如果不设置 `level`，低于 `WARNING` 的日志不会被输出。

------

## 四、自定义日志格式和输出位置

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='app.log',  # 输出到文件
    filemode='a'          # 追加模式
)

logging.debug("调试信息")
logging.info("一般信息")
logging.warning("警告信息")
```

输出到 `app.log` 文件中，格式为：

```
2025-04-22 10:00:00,123 - DEBUG - 调试信息
2025-04-22 10:00:00,124 - INFO - 一般信息
2025-04-22 10:00:00,125 - WARNING - 警告信息
```

------

## 五、使用 Logger 对象进行更灵活的日志管理

```python
import logging

# 创建 logger
logger = logging.getLogger('my_logger')
logger.setLevel(logging.DEBUG)

# 创建控制台 handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# 创建文件 handler
file_handler = logging.FileHandler('my_app.log')
file_handler.setLevel(logging.DEBUG)

# 设置日志格式
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# 添加 handler 到 logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# 使用 logger
logger.debug("这是 debug 信息")
logger.info("这是 info 信息")
logger.warning("这是 warning 信息")
```

这样你可以根据不同模块、不同需求，创建多个 logger 实例。

------

## 六、日志轮转（RotatingFileHandler）

为了防止日志文件过大，可以使用 `RotatingFileHandler`：

```python
from logging.handlers import RotatingFileHandler

logger = logging.getLogger('rotate_logger')
logger.setLevel(logging.INFO)

r_handler = RotatingFileHandler('rotating.log', maxBytes=1024, backupCount=3)
r_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))

logger.addHandler(r_handler)

for i in range(1000):
    logger.info(f"第 {i} 条日志")
```

这个配置会将日志写入 `rotating.log`，当文件大于 1KB 时自动滚动保存，保留最多 3 个历史文件。

------

好的，下面继续补充内容，涵盖 **`loguru` 的用法** 和 **多进程日志记录的正确方式**。这些内容非常实用，尤其在实际项目或服务部署中经常会用到。

------

## 七、使用 loguru：更现代的日志库

虽然 Python 内建的 `logging` 模块功能齐全，但配置略显繁琐。而 [`loguru`](https://github.com/Delgan/loguru) 是一个非常受欢迎的第三方日志库，它语法简洁、功能强大，是 `logging` 的现代替代方案。

### 1. 安装 loguru

```bash
pip install loguru
```

### 2. 快速上手

```python
from loguru import logger

logger.debug("这是 debug 信息")
logger.info("这是 info 信息")
logger.warning("这是 warning 信息")
logger.error("这是 error 信息")
```

默认输出就很漂亮，包含时间、等级、调用行号、颜色等信息。

### 3. 自定义日志格式 & 写入文件

```python
from loguru import logger

logger.add("app.log", rotation="1 MB", retention="7 days", compression="zip",
           format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}")

logger.info("日志记录到文件并自动轮转")
```

- `rotation="1 MB"`：日志文件超过 1MB 自动切换新文件
- `retention="7 days"`：保留 7 天的历史日志
- `compression="zip"`：历史日志自动压缩为 zip

### 4. 使用函数装饰器记录函数调用

```python
@logger.catch
def error_func():
    1 / 0

error_func()
```

自动捕捉异常并记录堆栈，非常适合调试。

------

## 八、多进程日志处理

在多进程程序中（如使用 `multiprocessing` 或 `celery`），**每个子进程有独立的日志对象**，直接使用 `logging` 或 `loguru` 写入文件，可能会出现混乱或文件竞争。

### 方案一：使用 `QueueHandler` + `QueueListener`（适用于 `logging`）

主进程管理日志写入，子进程将日志发到队列中。

```python
import logging
import logging.handlers
from multiprocessing import Process, Queue
import time

def worker(log_queue, i):
    logger = logging.getLogger(f'worker_{i}')
    logger.setLevel(logging.DEBUG)
    handler = logging.handlers.QueueHandler(log_queue)
    logger.addHandler(handler)

    logger.info(f"子进程 {i} 启动")

def log_listener(log_queue):
    root = logging.getLogger()
    handler = logging.FileHandler("multi.log")
    formatter = logging.Formatter('%(asctime)s - %(processName)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    root.addHandler(handler)
    root.setLevel(logging.DEBUG)

    while True:
        record = log_queue.get()
        if record is None:
            break
        root.handle(record)

if __name__ == "__main__":
    q = Queue()
    listener = Process(target=log_listener, args=(q,))
    listener.start()

    workers = [Process(target=worker, args=(q, i)) for i in range(3)]
    for w in workers:
        w.start()
    for w in workers:
        w.join()

    q.put(None)  # 停止监听进程
    listener.join()
```

### 方案二：loguru 中集成 multiprocessing 日志

`loguru` 本身不直接支持多进程写入同一个文件，但可以借助标准输出 + 日志收集的方式，或者你也可以为每个子进程设置独立日志文件。

例如为每个进程写不同文件：

```python
from loguru import logger
from multiprocessing import Process

def worker(i):
    logger.add(f"worker_{i}.log", rotation="500 KB")
    logger.info(f"这是子进程 {i} 的日志")

if __name__ == '__main__':
    ps = [Process(target=worker, args=(i,)) for i in range(3)]
    for p in ps:
        p.start()
    for p in ps:
        p.join()
```

------

## 九、结语

日志记录不仅仅是调试工具，更是系统运行状态的快照。在实际项目中：

- 小项目用 loguru，快速上手又功能齐全；
- 中大型服务建议搭配标准 `logging`、集中日志收集（如 ELK、Fluentd）；
- 多进程/分布式系统要注意避免文件竞争，推荐用日志队列或日志服务器。