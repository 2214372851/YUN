---
title: 设计模式
---

# 设计模式

## 接口

> 继承这个接口(类)的类必须实现其中的一些方法
>
> 接口：若干抽象方法的集合
>
> ​	作用：限制实现接口的类必须按照接口规定的调用方式实现这些方法;对高层模块隐藏了类的内部实现

1. 基础写法

   ```python
   class Pay:
       def pay(self, money):
           # 调用这个给方法时如果继承的类没有实现当前方法就报错
           raise NotImplementedError
   
   
   class WeChatPay(Pay):
       pass
   ```

   > 问题:当继承的类未调用当前方法时不会产生影响,接口失效

2. 抽象类

   ```python
   from abc import ABCMeta, abstractmethod
   
   
   class Pay(metaclass=ABCMeta):
     # 设置抽象方法
       @abstractmethod
       def pay(self):
           pass
   
   
   class WeChatPay(Pay):
       pass
   
   class AliPay(Pay):
   
       def pay(self):
           pass
   
   b = AliPay()
   a = WeChatPay()
   ```

   > 如果抽象类里的抽象方法未被实现,那么此类无法实例化

## 面向对象设计SOLID原则

> - 开放封闭原则
>
>   一个软件实体如类、模块和函数应该对扩展开放。对修改关闭。即软件实体应尽量不修改原有代码的情况下进行拓展。
>
> - 里氏替换原则
>
>   设有引用父类的地方必须内=能透明的使用其子类的对象。
>
>   抽象方法的实现应该，接收参数与返回参数一致
>
> - 依赖倒置原则
>
>   高层模块不应该依赖底层模块， 二者都应该依赖其抽象；凑想不应该依赖细节；细节应该依赖抽象。换而言之，要针对接口编程，而不是针对实现编程。
>
> - 接口隔离原则
>
>   使用多个专门的接口，而不使用单一的总接口，即客户端（高层代码）不应该依赖那些它不需要的接口。
>
>   谨慎使用总接口，有点继承时不需要用到这个接口的设有抽象方法，此时一改考虑拆分接口。
>
> - 单一职责原则
>
>   不要存在多余一个导致类变更的原因。也就是，一个类只负责一项职责。

## 设计模式分类

- 创建型模式
  - 工厂方法模式
  - 抽象工厂模式
  - 创建者模式
  - 原型模式
  - 单例模式
- 结构型模式
  - 适配器模式
  - 桥模式
  - 组合模式
  - 装饰模式
  - 外观模式
  - 享元模式
  - 代理模式
- 行为型模式
  - 解释器模式
  - 责任链模式
  - 命令模式
  - 迭代器模式
  - 中介者模式
  - 备忘录模式
  - 观察者模式
  - 状态模式
  - 策略模式
  - 访问者模式
  - 模板方法模式



## 创建型模式

> 创建对象时用到的模式

### 简单工厂模式

> - 内容
>
>   不直接向客户端暴露对象的实现细节，而是通过一个工厂类来负责创建产品类的实例
>
> - 角色
>   - 工厂角色（创建）
>   - 抽象产品角色（接口）
>   - 具体产品角色（继承接口的类）
> - 优点
>   - 隐藏了对象创建的实现细节
>   - 哭护短不需要修改代码
> - 缺点
>   - 违反了单一职责原则，将创建逻辑几种到一个工厂类里
>   - 当添加新产品时需要修改工厂类代码，违反了开闭原则
>
> ```python
> from abc import ABCMeta, abstractmethod
> 
> 
> class Pay(metaclass=ABCMeta):
>     @abstractmethod
>     def pay(self, money):
>         pass
> 
> 
> class WeChatPay(Pay):
>     def pay(self, money: int):
>         print('wechat{}'.format(money))
> 
> 
> class AliPay(Pay):
>     def __init__(self, user_method=False):
>         self.user_method = user_method
>     def pay(self, money: int):
>         if self.user_method:
>             print('huabei{}'.format(money))
>         else:
>             print('ali{}'.format(money))
> 
> 
> class PayFactory:
>     def create_pay(self, method: str):
>         # 对不同的方法进行中间处理，减少使用的多余操作
>         # 隐藏了类的内部实现
>         if method == 'alipay':
>             return AliPay()
>         elif method == 'huabei':
>             return AliPay(user_method=True)
>         elif method == 'wechat':
>             return WeChatPay()
>         else:
>             raise TypeError('没用这个方法（%s）' % method)
> 
> 
> pf = PayFactory()
> pf.create_pay('huabe').pay(100)
> ```

### 工厂方法模式

> - 内容
>
>   单一一个用于创建对象的接口（工厂接口），让子类决定实例化哪一个产品
>
> - 角色
>
>   - 抽象工厂角色
>   - 具体工厂角色
>   - 抽象产品角色
>   - 具体产品角色
>
> - 优点
>
>   - 每个具体产品都对应一个具体工厂类，不需要修改工厂类代码
>   - 隐藏了对象创建的实现细节
>
> - 缺点
>
>   - 没增家一个具体产品类，就必须增加一个相应的具体工厂类
>
> ```python
> from abc import ABCMeta, abstractmethod
> 
> 
> class Pay(metaclass=ABCMeta):
>     @abstractmethod
>     def pay(self, money):
>         pass
> 
> 
> class WeChatPay(Pay):
>     def pay(self, money: int):
>         print('wechat{}'.format(money))
> 
> 
> class AliPay(Pay):
>     def __init__(self, user_method=False):
>         self.user_method = user_method
> 
>     def pay(self, money: int):
>         if self.user_method:
>             print('huabei{}'.format(money))
>         else:
>             print('ali{}'.format(money))
> 
> 
> class PayMentFactory(metaclass=ABCMeta):
>     @abstractmethod
>     def create_method(self):
>         pass
> 
> 
> class AliPayFactory(PayMentFactory):
> 
>     def create_method(self):
>         return AliPay()
> 
> 
> class WeChatPayFactory(PayMentFactory):
> 
>     def create_method(self):
>         return WeChatPay()
> 
> 
> class HuaBei(PayMentFactory):
> 
>     def create_method(self):
>         return AliPay(user_method=True)
> 
> 
> pf = HuaBei()
> pf.create_method().pay(100)
> ```

### 抽象工厂模式

> - 内容
>
>   定义一个工厂类接口，让工厂子类来创建一系列相关或相互依赖的对象
>
> - 例子
>
>   生产一部手机，需要外壳、CPU、操作系统三类对象进行封装，其中每类对象都有不同的种类。对每个具体工厂，分别生产一部手机需要的三个对象
>
> - 相比工厂方法模式，抽象工厂模式中的每个具体工厂都生产一套产品
>
> - 角色
>
>   - 抽象工厂角色
>   - 具体工厂角色
>   - 抽象产品角色
>   - 具体产品角色
>   - 客户端
>
> - 优点
>
>   - 将客户端与类的具体实现分离
>   - 每个工厂创建了一个完整的产品系列，使得易于交换产品系列
>   - 有利于产品的一致性（产品间的约束关系）
>
> - 缺点
>
>   - 难以支持新种类的（抽象）产品
>
> ```python
> from abc import ABCMeta, abstractmethod
> 
> 
> # 抽象产品
> class PhoneShell(metaclass=ABCMeta):
>     @abstractmethod
>     def show_shell(self):
>         pass
> 
> 
> class PhoneCPU(metaclass=ABCMeta):
>     @abstractmethod
>     def show_cpu(self):
>         pass
> 
> 
> class PhoneOS(metaclass=ABCMeta):
>     @abstractmethod
>     def show_os(self):
>         pass
> 
> 
> # 抽象工厂
> class PhoneFactory(metaclass=ABCMeta):
>     @abstractmethod
>     def make_shell(self):
>         pass
> 
>     @abstractmethod
>     def make_cpu(self):
>         pass
> 
>     @abstractmethod
>     def make_os(self):
>         pass
> 
> 
> # 具体产品
> class SmallShell(PhoneShell):
>     def show_shell(self):
>         print('小手机壳')
> 
> 
> class HuaWeiShell(PhoneShell):
>     def show_shell(self):
>         print('华为手机壳')
> 
> 
> class GaoTongCPU(PhoneCPU):
>     def show_cpu(self):
>         print('高通CPU')
> 
> 
> class QiLingCPU(PhoneCPU):
>     def show_cpu(self):
>         print('麒麟CPU')
> 
> 
> class AppleOS(PhoneOS):
>     def show_os(self):
>         print('苹果系统')
> 
> 
> class HarmonyOS(PhoneOS):
>     def show_os(self):
>         print('鸿蒙系统')
> 
> 
> # 具体工厂
> class HuaWeiP50(PhoneFactory):
>     def make_shell(self):
>         return HuaWeiShell()
> 
>     def make_cpu(self):
>         return GaoTongCPU()
> 
>     def make_os(self):
>         return HarmonyOS()
> 
> 
> class Mi6(PhoneFactory):
>     def make_shell(self):
>         return SmallShell()
> 
>     def make_cpu(self):
>         return QiLingCPU()
> 
>     def make_os(self):
>         return AppleOS()
> 
> 
> # 客户端
> class Phone:
>     def __init__(self, cpu: PhoneCPU, os: PhoneOS, shell: PhoneShell):
>         self.cpu = cpu
>         self.os = os
>         self.shell = shell
> 
>     def show_info(self):
>         self.cpu.show_cpu()
>         self.os.show_os()
>         self.shell.show_shell()
> 
> 
> def make_phone(factory: PhoneFactory):
>     cpu = factory.make_cpu()
>     os = factory.make_os()
>     shell = factory.make_shell()
>     return Phone(cpu, os, shell)
> 
> 
> p1 = make_phone(HuaWeiP50())
> p1.show_info()
> ```



















