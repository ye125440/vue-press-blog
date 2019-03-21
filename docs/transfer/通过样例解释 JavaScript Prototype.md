# 通过样例解释 JavaScript Prototype

原文地址：[http://www.javascripttutorial.net/javascript-prototype/](http://www.javascripttutorial.net/javascript-prototype/)



**摘要**：JavaScript Prototype 是每个 JavaScript 开发人员必须理解的最重要的概念之一。本教程详细解释了原型概念，并清除了所有关于原型的混淆。



要学习本教程，您必须理解 [JavaScript 对象](http://www.javascripttutorial.net/javascript-objects/)。如果您不熟悉 JavaScript 中的对象，在继续学习本教程之前，您应该先学习 [JavaScript 对象](http://www.javascripttutorial.net/javascript-objects/)教程。



## JavaScript Prototype 介绍

默认情况下，JavaScript 引擎提供 `Object()` 函数和一个可以通过 `Object.prototype` 引用的匿名对象。

```
console.log(Object);
console.log(Object.prototype);
```

`Object.prototype` 对象有许多内置属性，如 `toString()`、`valueOf()` 等。它还有一个名为 `constructor` 的属性，指向 `Object()` 函数。

```
console.log(Object.prototype.constructor === Object); // true
```

假设圆代表一个函数，正方形代表一个对象。下图说明了 `Object()` 函数和 `Object.prototype` 对象之间的关系:

![javascript-prototype](http://www.javascripttutorial.net/wp-content/uploads/2016/09/JavaScript-Prototype.png)

首先，让我们定义一个名为 `Foo` 的函数，如下所示:

```
function Foo(name) {
    this.name = name;
}
```

`Foo()` 函数接受一个参数，将 `name` 属性添加到对象中，并将 `name` 参数值赋给属性。

在幕后，JavaScript 引擎创建一个新的函数 `Foo()` 和一个匿名对象。`Foo()` 函数有一个名为 `prototype` 的属性指向匿名对象。匿名对象的 `constructor` 属性指向 `Foo()` 函数。

此外，原型对象通过 `[[prototype]]` 链接到 `Object.prototype`，这被称为*原型链接(prototype linkage)*。下图中的原型链接由 `[[prototype]]` 表示。

![JavaScript Prototype - Function defined](http://www.javascripttutorial.net/wp-content/uploads/2016/09/JavaScript-Prototype-Function-defined.png)

其次，向 `Foo.prototype` 对象中添加一个名为 `whoAmI()` 的新方法。

```
Foo.prototype.whoAmI = function() {
    return "I am " + this.name;
}
```

![JavaScript Prototype - add method to prototype](http://www.javascripttutorial.net/wp-content/uploads/2016/09/JavaScript-Prototype-Function.png)

第三，创建 `Foo` 对象的新实例。

```
var a = new Foo('a');
```

在内部，JavaScript引擎创建一个名为 `a` 的新对象，并通过原型链接将 `a` 对象链接到 `Foo.prototype` 对象。

![JavaScript Prototype - create a new object](http://www.javascripttutorial.net/wp-content/uploads/2016/09/JavaScript-Prototype-New-Object.png)

对象 `a` ，`Foo.prototype` 和 `Object.protoype` 的链接称为*原型链(prototype chain)*。

第四，创建另一个名为 `b` 的 `Foo` 对象实例。

```
var b = new Foo('b');
```

![JavaScript Prototype - create a new object](http://www.javascripttutorial.net/wp-content/uploads/2016/09/JavaScript-Prototype-second-object.png)

第五，向 `b` 对象添加新的 `say()` 方法。

```
b.say = function() {
    console.log('Hi from ' + this.whoAmI());
}
```

JavaScript 引擎将 `say()` 方法添加到 `b` 对象，而不是 `Foo.prototype` 对象。

![JavaScript Prototype - add method to object](http://www.javascripttutorial.net/wp-content/uploads/2016/09/JavaScript-Prototype-add-method-to-object.png)

现在，请看下面的代码。

```
console.log(a.constructor); // Foo
```

对象 `a` 没有 `constructor` 属性，因此，JavaScript 引擎会进入原型链找到它。因为对象 `a` 通过原型链接链接到 `Foo.prototype` 对象，并且 `Foo.prototype` 具有构造函数属性，所以 JavaScript 引擎返回 `Foo`。因此，以下语句返回 `true`。

```
console.log(a.constructor === Foo); // true
```

## 获取原型链接

`__proto__` 的发音是 *dunder proto*。`__proto__` 是 `Object.prototype` 对象的[访问器属性(accessor property)](http://www.javascripttutorial.net/javascript-objects/#accessor_property)。它公开了一个对象的内部原型链接( `[[Prototype]]` )，通过这个属性可以访问它。

`__proto__`已在 [ES6](http://www.javascripttutorial.net/es6/) 中标准化，以确保网络浏览器的兼容性。但是，将来可能会为了支持 `Object.getPrototypeOf()` 而将它废除。因此，您永远不应该在您的生产代码中使用 `__proto__`。

正如您在前面的图表中所见的， `a.__proto__` 公开了指向 `Foo.prototype` 对象的 `[[prototype]]` 属性。同样，`b.__proto__` 指向和 `a.__proto__` 同样的对象：

```
console.log(a.__proto__ === Foo.prototype); // true
console.log(a.__proto__ === b.__proto__); // true
```

如前文所述，您应该使用 `Object.getPrototypeOf()` 方法，而不是 `__proto__`。 `Object.getPrototypeOf()` 方法返回指定对象的原型。

```
console.log(a.__proto__ === Object.getPrototypeOf(a)); // true
```

当 `Object.getPrototypeOf()` 方法不可用时，开发人员经常使用如下的另一种方法是通过 `constructor` 属性获得原型链接：

```
a.constructor.prototype
```

`a.constructor` 返回 `Foo` ，因此， `a.constructor.prototype`  返回原型对象。

## 遮蔽

看下面的方法调用。

```
console.log(a.whoAmI()); // I am a
```

`a` 对象没有方法 `whoAmI()`，因此当从 `a` 对象调用此方法时，JavaScript 引擎会进入原型链并找到它。在这种情况下，它在 `Foo.prototype` 对象中找到方法并执行。

让我们在 `a` 对象添加一个和 `Foo.prototype` 对象中同名的新方法。

```
a.whoAmI = function() {
    console.log('This is ' + this.name);
}
```

并调用 `whoAmI()` 方法：

```
console.log(a.whoAmI()); // This is a
```

因为我们在 `a` 对象中有 `whoAmI()` 方法，所以 JavaScript 引擎只是立即执行它，而不用在原型链中查找它。

这是遮蔽(shadowing)的一个例子。对象的 `whoAmI()` 方法遮蔽了对象链接到的原型对象的 `whoAmI()`方法。

现在，您应该理解与 JavaScript 原型相关的所有重要概念，包括原型链、原型链接、dunder proto 和遮蔽。