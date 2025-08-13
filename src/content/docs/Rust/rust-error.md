---
title: Rust 错误处理
---

## `anyhow`：应用级错误处理利器

### 1. 适用场景
`anyhow` 适用于以下场景：

- 应用层开发（如 CLI 工具、服务端主程序）。
- 快速开发、原型设计时，错误处理逻辑简单，不需要精确区分错误类型。
- 希望减少样板代码，快速捕获和传播错误。

### 2. 核心特性
- **通用错误类型**：`anyhow::Error` 是一个动态错误类型，适合处理多种错误来源。
- **自动错误转换**：通过 `?` 操作符，可以将任何实现了 `std::error::Error` 的类型自动转换为 `anyhow::Error`。
- **上下文信息**：支持链式上下文，便于调试和定位错误根源。
- **错误链支持**：可以保存错误链的完整信息，呈现更详细的错误报告。

---

### 3. 使用教程

#### 3.1 安装
在 `Cargo.toml` 中添加：
```toml
[dependencies]
anyhow = "1.0"
```

#### 3.2 创建和返回错误
用 `anyhow!` 宏创建一个错误，并返回 `anyhow::Result`：
```rust
use anyhow::{anyhow, Result};

fn might_fail(succeed: bool) -> Result<()> {
    if succeed {
        Ok(())
    } else {
        Err(anyhow!("操作失败")) // 创建一个错误
    }
}

fn main() -> Result<()> {
    might_fail(false)?; // 使用 `?` 自动传播错误
    Ok(())
}
```

#### 3.3 自动错误转换

`anyhow` 支持将标准库或第三方库的错误类型自动转换为 `anyhow::Error`，结合 `?` 使用非常方便：

```rust
use std::fs::File;
use anyhow::Result;

fn open_file(filename: &str) -> Result<File> {
    let file = File::open(filename)?; // 自动将 `std::io::Error` 转换为 `anyhow::Error`
    Ok(file)
}
```

#### 3.4 添加上下文信息
上下文信息可以帮助我们更好地定位错误原因。`anyhow` 提供了 `with_context` 与 `context` 方法来添加上下文：
```rust
use std::fs::File;
use anyhow::{Context, Result};

fn open_file_with_context(filename: &str) -> Result<File> {
    let file = File::open(filename)
        .with_context(|| format!("无法打开文件: {}", filename))?; // 添加上下文信息
    let file = File::open(filename)
        .context("无法打开文件")?; // 添加上下文信息，只能是静态
    Ok(file)
}
```

#### 3.5 错误链
`anyhow::Error` 支持错误链，可以在错误被转换时保留原始错误信息：
```rust
use std::fs::File;
use std::io::Read;
use anyhow::{anyhow, Result};

fn read_file(filename: &str) -> Result<String> {
    let mut file = File::open(filename)
        .map_err(|e| anyhow!("打开文件失败: {}", e))?; // 添加错误上下文
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| anyhow!("读取文件失败: {}", e))?; // 添加错误上下文
    Ok(contents)
}
```

#### 3.6 `anyhow` 和日志结合
结合日志库（如 `log` 或 `tracing`），可以记录错误链的详细信息：
```rust
use anyhow::{Context, Result};
use log::error;

fn main() -> Result<()> {
    env_logger::init(); // 初始化日志
    if let Err(e) = open_file_with_context("nonexistent.txt") {
        error!("发生错误: {:?}", e); // 打印错误链
    }
    Ok(())
}

fn open_file_with_context(filename: &str) -> Result<()> {
    std::fs::read_to_string(filename)
        .with_context(|| format!("无法读取文件: {}", filename))?;
    Ok(())
}
```

---

### 4. 最佳实践
1. **快速开发**：在应用开发中，`anyhow` 是快速处理错误的最佳选择，可以减少大量样板代码。
2. **上下文信息**：使用 `.with_context()` 提供额外信息，便于定位问题。
3. **错误边界**：在应用程序边界（如库调用处），捕获并转换错误为 `anyhow::Error`，统一处理。

---

## 二、`thiserror`：库级自定义错误的首选

### 1. 适用场景

`thiserror` 适用于以下场景：
- 库开发中，需定义具体的错误类型，便于调用者进行模式匹配。
- 需要静态错误类型，便于区分不同错误原因。

### 2. 核心特性
- **自动实现 `Error` trait**：通过派生宏自动生成实现。
- **支持字段插值**：错误信息可以动态包含字段值。
- **与 `?` 操作符兼容**：通过 `#[from]` 属性，支持错误类型之间的自动转换。
- **错误链支持**：支持嵌套错误，保留原始错误信息。

---

### 3. 使用教程

#### 3.1 安装
在 `Cargo.toml` 中添加：
```toml
[dependencies]
thiserror = "1.0"
```

#### 3.2 定义错误类型
使用 `#[derive(Error)]` 定义自定义错误类型：
```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum MyError {
    #[error("找不到文件: {0}")]
    NotFound(String),

    #[error("IO 错误")]
    Io(#[from] std::io::Error), // 自动实现 `From<std::io::Error>`

    #[error("无效的值: {value} (允许值: {allowed:?})")]
    InvalidValue { value: i32, allowed: Vec<i32> },
}
```

#### 3.3 使用自定义错误
```rust
fn read_file(file_path: &str) -> Result<String, MyError> {
    std::fs::read_to_string(file_path).map_err(MyError::from) // 自动转换 std::io::Error 为 MyError::Io
}
```

#### 3.4 区分错误类型
在调用方，可以通过模式匹配区分不同的错误类型：
```rust
fn main() {
    match read_file("nonexistent.txt") {
        Ok(content) => println!("文件内容: {}", content),
        Err(MyError::NotFound(path)) => println!("文件未找到: {}", path),
        Err(MyError::Io(e)) => println!("IO 错误: {}", e),
        Err(MyError::InvalidValue { value, allowed }) => {
            println!("无效的值: {}, 允许值: {:?}", value, allowed)
        }
    }
}
```

---

### 4. `anyhow` 和 `thiserror` 的结合使用

#### 场景：库层使用 `thiserror`，应用层使用 `anyhow`
1. 在库中定义自定义错误类型：
```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum LibraryError {
    #[error("文件读取失败: {0}")]
    ReadError(String),
    #[error("解析错误")]
    ParseError(#[from] std::num::ParseIntError),
}
```

2. 在应用层用 `anyhow` 捕获和处理：
```rust
use anyhow::{Context, Result};

fn main() -> Result<()> {
    let result = library_function("data.txt").context("库调用失败")?;
    println!("结果: {}", result);
    Ok(())
}

fn library_function(filename: &str) -> Result<i32, LibraryError> {
    let content = std::fs::read_to_string(filename).map_err(|_| LibraryError::ReadError(filename.into()))?;
    let number: i32 = content.trim().parse()?;
    Ok(number)
}
```

---

### 5. `anyhow` 与 `thiserror` 的对比

| 特性           | **anyhow**                       | **thiserror**                 |
| -------------- | -------------------------------- | ----------------------------- |
| **适用场景**   | 应用层快速开发                   | 库层自定义错误                |
| **错误类型**   | 动态错误（`anyhow::Error`）      | 静态错误（自定义枚举/结构体） |
| **上下文信息** | 支持链式上下文（`with_context`） | 需手动添加                    |
| **错误链**     | 支持                             | 支持                          |
| **模式匹配**   | 不支持                           | 支持                          |

