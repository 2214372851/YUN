---
title: 循环引用
---

- “循环引用”在 Python 里通常指两种不同问题：对象之间的引用环（影响垃圾回收）和模块之间的循环导入（导入时初始化顺序问题）。  
- 对象环用 weakref、weakref.finalize、手动断开引用或重构设计解决；避免或替代 __del__。  
- 模块循环导入常用解法：延迟导入（局部 import）、重构公共模块、或像下面展示的“PEP 562 + importlib + TYPE_CHECKING”模式做惰性导出，兼顾类型检查与运行时惰性加载。  

---

## 一、对象之间的循环引用（内存与垃圾回收）

为什么会出现问题  
- CPython 以引用计数为主：引用计数为 0 时立即回收。两个或多个对象互相引用会形成环，外部引用解除后对象引用计数不为 0，从而不会被引用计数立即回收。  
- CPython 有一个补充的垃圾回收器（gc 模块）来识别并回收不可达的循环。但如果循环内存在定义了 __del__ 的对象，GC 不会自动销毁（会把这些对象放到 gc.garbage），以避免不确定的析构顺序。

示例（有问题的情形）：
```python
class A:
    def __init__(self):
        self.b = None
    def __del__(self):
        print("A.__del__")

class B:
    def __init__(self):
        self.a = None
    def __del__(self):
        print("B.__del__")

a = A()
b = B()
a.b = b
b.a = a

del a
del b

import gc
gc.collect()
print(gc.garbage)  # 有 __del__ 的循环可能会出现在这里
```

解决策略（实用优先级）  
1. 使用 weakref 打破循环（子对象保持对父对象的弱引用）：
```python
import weakref

class Parent:
    def __init__(self):
        self.children = []

class Child:
    def __init__(self, parent):
        self.parent = weakref.ref(parent)  # 弱引用
```

2. 避免或移除 __del__，改用 context manager 或 weakref.finalize：
```python
import weakref

class Resource:
    def __init__(self):
        self._fin = weakref.finalize(self, self._cleanup)
    def _cleanup(self):
        print("cleaning up")
```

3. 手动断开引用：在生命周期末尾显式将属性设为 None 或 del 引用。  
4. 重构设计：避免长期的双向强引用，采用单向引用或集中管理（manager/registry）模式。  

调试工具与方法  
- gc.collect(), gc.garbage, gc.set_debug(gc.DEBUG_LEAK)  
- sys.getrefcount(obj)（注意此函数会增加一次引用计数）  
- 内存/堆快照工具（heapy、tracemalloc）用于长期运行程序的泄漏定位

---

## 二、模块之间的循环导入（circular import）

是什么问题  
- 模块 A 在顶层 import 模块 B，同时 B 在顶层 import A，导入时会在一个模块尚未完成初始化时访问其名字，导致 AttributeError、ImportError 或获得 None/部分初始化对象。

简单示例（会失败）：
a.py
```python
from b import B

class A:
    def __init__(self):
        self.b = B()
```
b.py
```python
from a import A

class B:
    def __init__(self):
        self.a = A()
```
导入 a 或 b 会在初始化过程中反复导入对方，通常导致错误。

常用解决办法  
- 局部延迟导入（把 import 放到函数/方法内部）：
```python
def make_b():
    from a import A
    return B(A())
```
- 把共同依赖的抽象/类型放到独立模块（例如 common.py），减少互相依赖。  
- 使用 typing.TYPE_CHECKING + 字符串注解 支持静态类型检查但不在运行时导入。  

下面介绍一个典型并且工程中常见的惰性导出模式（解决循环导入与启动开销）：PEP 562 (__getattr__ on modules) + importlib + TYPE_CHECKING。你之前给出的代码就是这种模式的一个实现 —— 我把它直接作为“实战示例”放在这里并逐行解释。

---

## 三、包级惰性导出（PEP 562 + TYPE_CHECKING + importlib）

```python
from importlib import import_module
from typing import TYPE_CHECKING

__all__ = ["KafkaScheduler", "LocalScheduler", "Crawler", "Result", "Request", "Response", "__version__"]
__version__ = "0.1.0-alpha.4"

if TYPE_CHECKING:
    from .scheduler import KafkaScheduler, LocalScheduler
    from .core import Crawler, Result
    from ._http import Request
    from .core import Response

_QUALNAME_MAP = {
    "KafkaScheduler": (".scheduler", "KafkaScheduler"),
    "LocalScheduler": (".scheduler", "LocalScheduler"),
    "Crawler": (".core", "Crawler"),
    "Result": (".core", "Result"),
    "Request": ("._http", "Request"),
    "Response": (".core", "Response"),
}

def _load_attr(name: str):
    if name not in _QUALNAME_MAP:
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
    modname, attr = _QUALNAME_MAP[name]
    module = import_module(modname, __name__)
    return getattr(module, attr)

def __getattr__(name: str):
    """
    PEP 562: 当访问 module.attr 且 attr 不存在于模块全局时，会调用此函数。
    在这里我们执行真正的导入并将结果缓存到 globals() 中，以避免重复导入。
    """
    if name in _QUALNAME_MAP:
        val = _load_attr(name)
        globals()[name] = val  # 缓存到模块全局，后续访问直接命中
        return val
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

def __dir__():
    # 让 autocompletion 与 dir() 显示延迟导入的名称
    return sorted(list(globals().keys()) + list(_QUALNAME_MAP.keys()))
```

这段代码解决的问题与原理
- 问题场景：包想在顶层统一导出若干类/函数（便于用户 `from package import KafkaScheduler`），但这些类分散在不同子模块，且这些子模块互相 import（或引用包级符号），导致在包导入时形成循环导入或初始化顺序错误。  
- 方案思路：不要在包导入时立即导入这些子模块，而是在第一次访问某个名称（例如 package.KafkaScheduler）时再去 import 子模块并取出属性 —— 这就把“导入时机”从包导入时延后到使用时，打破循环。

解释每一部分
- __all__ / __version__: 对外 API 列表与版本号，常规声明。  
- TYPE_CHECKING: 仅在静态类型检查时（mypy、IDE）执行这些导入，帮助类型检查器理解名字的类型，但这些导入不会在运行时发生，避免制造循环导入。  
- _QUALNAME_MAP: 把公开名称映射到（子模块相对路径, 名称）。便于统一管理与查找。  
- _load_attr 使用 importlib.import_module 进行相对导入，并返回目标属性。用 importlib 的好处是可以在运行时按需导入模块。  
- __getattr__（PEP 562，Python 3.7+）: 当访问模块属性且该属性未定义时会被调用；这里实现了惰性加载与缓存（globals()[name] = val），第一次访问会导入并缓存，后续直接从模块全局取。  
- __dir__: 让 IDE/REPL 的自动补全与 dir() 能列出这些延迟导出项，改善可用性与体验。

优点
- 打破循环导入：延迟导入避免包顶层导入期间触发复杂互相依赖的子模块导入。  
- 启动性能：减少包导入时的开销，只有真正使用某个符号时才导入对应模块。  
- 类型检查支持：TYPE_CHECKING 块兼顾静态类型检查器与运行时分离。  
- 用户 API 简洁：对外看起来仍然是统一包级导出。

局限与注意事项
- Python 版本：需要 Python >= 3.7（PEP 562）。若需兼容更早版本，需要别的方案（显式延迟导入函数或包装器）。  
- 顶层副作用（side effects）：如果子模块在顶层执行重要副作用（例如注册、启动线程、改变全局状态），延迟导入会改变副作用发生的时间，可能影响行为。建议子模块避免复杂顶层副作用。  
- 并发/线程竞争：import 过程受 Python 导入锁保护，通常不会发生严重重复导入问题，但在极端并发场景下，多线程几乎同时触发 _load_attr 可能会出现短暂重复执行并设置 globals()[name]。若极度敏感，可在模块层加锁保护（threading.Lock）。  
- 调试体验：如果子模块导入失败，异常会在第一次访问属性时抛出，而不是在包导入时，这需要注意排查堆栈。  
- IDE 跳转/自动补全：TYPE_CHECKING 与 __dir__ 大部分 IDE 能正确处理，但某些工具对动态导入支持不完美。测试常用 IDE（PyCharm、VSCode）表现以确保开发体验。  
- from package import Name：在大多数 Python 版本下，PEP 562 实现的 __getattr__ 会在此场景下被触发并返回值；但仍建议写单元测试覆盖这类导入用法以验证行为一致。

如何和其他方法配合使用  
- 若只是少数函数/类引起循环，优先考虑局部延迟导入（放在需要处）。  
- 若包需要暴露很多名称且要兼顾导入性能与 API 清晰度，用该惰性导出模式是个优雅选择。  
- 对外公开类型信息（typing）可继续用 TYPE_CHECKING 或字符串注解（"Crawler"）。

示例：如何在用户代码中使用（概念性）
```python
import package
Scheduler = package.KafkaScheduler  # 第一次访问会触发实际导入
```
或
```python
from package import KafkaScheduler  # 在 import 时也会触发 __getattr__ 并导入
```

---

## 四、实用检查清单（遇到“循环引用/循环导入”时怎么做）

对象循环（内存泄漏）：
- 是否有 __del__？先尝试移除或替代为 weakref.finalize。  
- 是否能用 weakref 替代双向强引用？  
- 使用 gc.collect() + gc.garbage 检查未回收对象，使用 tracemalloc/objgraph 分析引用链。  
- 在关键路径添加单元/集成测试并监控长期运行内存。

模块循环导入：
- 先尝试局部延迟导入（最简单、最低侵入）。  
- 若大量顶层导出需要惰性加载，考虑 PEP 562 + importlib 模式（上文示例）。  
- 把公共类型/基类抽取到独立模块，减少交叉依赖。  
- 为 from package import Name 与 import package; package.Name 两种用法写测试。  
- 如果支持静态类型检查器，使用 TYPE_CHECKING 和字符串注解确保类型信息可用。

---

## 五、总结与建议

- 区分“对象循环”与“模块循环导入”是解决问题的第一步。两者的定位、调试与解决策略不同。  
- 对象循环优先考虑 weakref、重构或替代 __del__；模块循环 import 优先考虑局部延迟导入或重构模块结构。  
- 如果需要对外暴露统一的包级 API，但包内子模块互相依赖，使用 PEP 562（模块级 __getattr__）+ importlib.import_module + TYPE_CHECKING 的惰性导出模式，是一个工程上可维护且兼顾类型检查的优雅方案（见文中示例）。  
- 无论采用哪种修复方式，都建议添加单元测试、对用户导入场景进行覆盖，并在 CI 中监测内存/导入行为。
