---
title: 消除异步传染性
category: JavaScript
excerpt: JavaScript 中消除异步函数的传染性
lastEdited: 2025年4月23日
tags: [JavaScript,Promise]
---

`async/await` 是现代 JavaScript 中处理异步逻辑的主流方式，它让代码更清晰、更像同步流程。但随着项目变大，开发者很容易掉进一个陷阱：**异步传染性（async contagion）**。

这篇文章将带你了解异步传染性的本质，以及如何在 JavaScript 中设计更健壮、更优雅的异步调用结构。

------

## 一、什么是异步传染性？

当一个函数使用了 `async`，它就必须返回 `Promise`。这会导致它的**调用者也必须是异步函数**，使用 `await` 来获取结果，否则只能得到一个 `Promise` 对象。

举个简单的例子：

```javascript
async function fetchData() {
  const res = await fetch('/api/data');
  return res.json();
}

function process() {
  const data = fetchData(); // ❌ 这里拿到的是 Promise，不是数据本身
  console.log(data); // [object Promise]
}
```

你必须把 `process` 改成 `async` 才能正确使用 `await`，这就导致异步像“病毒”一样从一个函数扩散到整个代码结构。

------

## 二、异步传染会带来什么问题？

- **测试复杂**：测试函数时需要处理 Promise 或使用 `async` 测试框架。
- **代码膨胀**：本来只想获取一段数据，结果调用链上全变 `async`。
- **逻辑耦合**：业务逻辑被迫关注异步细节，难以抽象或复用。
- **出错难排查**：如果你忘记了 `await`，bug 可能不会立即爆发，但行为已悄悄错乱。

------

## 三、如何缓解异步传染性？

### 1. 在“边界层”调用 async，不往上传

我们可以把异步调用放在控制器、页面入口、或事件处理器等边界层，在内部尽量保持同步风格。

```javascript
// 边界层：React 事件处理器
const handleClick = async () => {
  const data = await fetchData();
  renderData(data);
};

// 内部函数保持纯逻辑，不关心 async
function renderData(data) {
  console.log(data);
}
```

### 2. 对外暴露同步接口，内部异步转同步（谨慎使用）

有时可以通过“等待执行”的方法在外部提供同步接口（例如同步缓存读取）：

```javascript
let cachedData = null;

async function fetchData() {
  if (!cachedData) {
    const res = await fetch('/api/data');
    cachedData = await res.json();
  }
  return cachedData;
}

// 封装一个同步访问方法（需要确保数据已经预加载）
function getDataSync() {
  if (cachedData) return cachedData;
  throw new Error('Data not ready. Please preload first.');
}
```

适合缓存场景，不能用在首次就要立即访问数据的逻辑中。

### 3. 用高阶函数/回调桥接同步逻辑

如果你需要将异步结果“注入”到同步逻辑中，考虑用回调或高阶函数：

```javascript
async function loadDataAndRun(fn) {
  const data = await fetchData();
  fn(data); // 业务逻辑在同步函数中运行
}

// 使用方式
loadDataAndRun(data => {
  processData(data); // processData 保持同步
});
```

这种方式适用于需要把异步加载和同步处理解耦的场景。

------

## 四、解决方案

“异步任务劫持与缓存”机制，类似于 React Suspense 的理念，即：在首次异步调用时抛出 Promise，后续根据异步状态走不同的逻辑路径。

这段函数的核心目的是：

> 劫持 `window.fetch`，在异步任务（如网络请求）**第一次调用时中断执行，等任务完成后自动重试并缓存结果**。同时也避免了同步函数去调用异步函数时的传染。

```js
function task(func) {
    const oldFetch = window.fetch; // 保存原始 fetch 函数

    const cache = {
        status: 'pending', // 状态：pending（等待中）、resolved（已完成）、rejected（已失败）
        result: null       // 存储 fetch 的结果或错误
    };

    // 定义新的 fetch
    const newFetch = function (...args) {
        if (cache.status === 'resolved') {
            // 如果已经成功，直接返回缓存结果
            return cache.result;
        } else if (cache.status === 'rejected') {
            // 如果已经失败，抛出缓存错误
            throw cache.result;
        } else {
            // 第一次调用 fetch，发起请求并抛出 promise，阻断执行
            const taskPromise = oldFetch(...args).then((res) => {
                cache.status = 'resolved';
                cache.result = res;
            }).catch((err) => {
                cache.status = 'rejected';
                cache.result = err;
            });
            throw taskPromise;
        }
    };

    window.fetch = newFetch; // 替换 fetch

    try {
        func(); // 执行用户传入的函数
    } catch (error) {
        if (error instanceof Promise) {
            // 捕获异步中断，等 Promise 结束后自动重试 func
            error.finally(() => {
                window.fetch = newFetch;
                func(); // 重新执行 func，此时数据已准备好
                window.fetch = oldFetch;
            });
        } else {
            throw error; // 如果不是 Promise 异常，则正常抛出
        }
    }

    window.fetch = oldFetch; // 恢复原始 fetch
}
```

特别适合用在「一次性请求 + 多次复用 + 类 Suspense 渲染」的场景中：

- 页面初始化时加载一次远程数据；
- 控制函数在数据准备好前不执行；
- 实现“数据到达后自动重试逻辑”；
- 避免重复 fetch。

通过以下代码也验证了该逻辑可以消除异步函数的传染性，但是改代码仅为思路，实际使用需要考虑多 `fetch` 等情况

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>测试 task 函数</title>
</head>

<body>
<div id="output">加载中...</div>
<script>
    // task 函数从你之前提供的版本拷贝即可
    function task(func) {
        const oldFetch = window.fetch;
        const cache = {
            status: 'pending',
            result: null
        };
        const newFetch = function (...args) {
            if (cache.status === 'resolved') {
                return cache.result;
            } else if (cache.status === 'rejected') {
                throw cache.result;
            } else {
                throw oldFetch(...args).then((res) => {
                    cache.status = 'resolved';
                    cache.result = res;
                }).catch((err) => {
                    cache.status = 'rejected';
                    cache.result = err;
                });
            }
        };
        window.fetch = newFetch
        try {
            func();
        } catch (error) {
            if (error instanceof Promise) {
                error.finally(() => {
                    window.fetch = newFetch;
                    func();
                    window.fetch = oldFetch;
                });
            } else {
                throw error;
            }
        }
        window.fetch = oldFetch;
    }

    // ✅ 测试函数 —— 同步逻辑中直接使用 fetch
    function myComponent() {
        console.log('myComponent');
        return fetch('https://jsonplaceholder.typicode.com/todos/1');
    }

    function m1() {
        const result = myComponent();
        const output = document.getElementById('output');
        output.innerHTML = result;
        console.log(result);
    }

    // ✅ 执行任务，task 将自动处理中断 & 重试
    task(m1);
</script>
</body>

</html>
```

