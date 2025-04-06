---
title:  React框架
---



# React

## JSX 语法规则

1. 定义虚拟 DOM 时，不要写引号
2. 标签中混入 JS 表达式值时需要使用 `{}` 包裹
3. 标签的样式类名指定时不要使用 `class`，要用 `className`
4. 内联样式，要用 `style={{key: value}}` 的形式
5. 虚拟  DOM 只能有一个根标签
6. 标签必须闭合
7. 标签首字母
    1. 若小写字母开头，则将该标签转为html中的同名元素
    2. 若大写字母开头，React就去渲染对应的组件，若组件没有定义则报错

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>测试CDN React</title>
    <style>
        .title {
            color: red;
        }
    </style>
</head>

<body>
<div class="app"></div>
<script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/react/18.2.0/umd/react.production.min.js"></script>
<script
        src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/babel-standalone/6.26.0/babel.min.js"></script>

<script type="text/babel">
    const myId = 'test'
    const myData = 'Hello, React!'
    // 创建虚拟DOM
    const VDOM = (
        <div>
            <h2 id={myId} className="title">
                <span style={{
                    color: 'blue',
                    fontSize: '30px'
                }}>
                    {myData}
                </span>
            </h2>
            <label>
                <input type="text"/>
            </label>
            <good>123</good>
        </div>
    )
    // 渲染虚拟DOM
    ReactDOM.render(VDOM, document.querySelector('.app'))
</script>
</body>

</html>
```

### 语句和表达式的区别

1. 表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方
    1. `a` 变量
    2. `a + b`
    3. `demo(1)`
    4. `arr.map()`
    5. `function test () {}`
2. 语句（代码）
    1. `if () {}`
    2. `for () {}`
    3. `.switch()(case: xxx)`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>测试CDN React</title>
    <style>
        .title {
            color: red;
        }
    </style>
</head>

<body>
<div class="app"></div>
<script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/react/18.2.0/umd/react.production.min.js"></script>
<script
        src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/babel-standalone/6.26.0/babel.min.js"></script>

<script type="text/babel">
    // 创建虚拟DOM
    const data = [
        'Angular',
        'Vue',
        'React'
    ]
    const VDOM = (
        <div>
            <ul>
                {
                    data.map((item, index) => {
                        return <li key={index}>{item}</li>
                    })
                }
            </ul>
        </div>
    )
    // 渲染虚拟DOM
    ReactDOM.render(VDOM, document.querySelector('.app'))
</script>
</body>

</html>
```



### 模块与组件、模块化与组件化

### 模块

- 向外提供特定功能的js程序，一般是一个js文件
- 作用：复用代码，简化代码编写，提高运行效率

### 组件

- 用来实现局部功能效果的代码和资源合集（html/css/js/image 等）
- 作用：复用代码，简化项目编码，提高运行效率

### 模块化

当应用的 js 都以模块来编写，这就是一个模块化的应用

### 组件化

当应用是以多组件的方式实现，这个应用就是一个组件化的应用



## React 面向组件编程

### 基本理解和使用

#### 函数式组件

使用函数定义的组件，适用于简单组件

> React 解析组件标签，找到组件后，发现组件是函数定义的，随后调用该函数，将虚拟DOM转为真实DOM，呈现在页面上

```html
<!doctype html>
<html lang="cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Document</title>
</head>
<body>
<div id="app"></div>
<script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/react/18.2.0/umd/react.production.min.js"></script>
<script
        src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/babel-standalone/6.26.0/babel.min.js"></script>
<script type="text/babel">
    // 创建函数式组件
    function Demo() {
        return (
            <ul>
                {
                    [1, 2, 3].map((item, index) => {
                        return <li key={index}>{item}</li>
                    })
                }
            </ul>
        )
    }
    // 渲染组件
    ReactDOM.render(<Demo/>, document.querySelector('#app'))
</script>
</body>
</html>
```



#### 类式组件

##### 类的基本知识

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script type="text/javascript">
    class Person {
        // 构造函数，用于初始化 Person 类的实例属性
        constructor(name, age) {
            // 初始化实例属性
            this.name = name;
            this.age = age;
        }

        // 一般的方法，放到了 Person 类的原型上，供 Person 类的实例调用
        sayHello() {
            // say hello 方法放到了 Person 类的原型上，供 Person 类的实例调用
            console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
        }
    }

    class SuperPerson extends Person {
        constructor(name, age, sex) {
            super(name, age);
            this.sex = sex;
        }

        sayHello() {
            console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
        }
    }

    const p1 = new Person('John', 30);
    console.log(p1)
    p1.sayHello();
    // 调用 sayHello 方法，this 指向 {name: 'John', age: 30}
    p1.sayHello.call({name: 'tom', age: 20})

</script>
</body>
</html>
```



使用类定义的组件适用于复杂组件


