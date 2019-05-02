# 发现 VueJS 中闭包的能力

原文地址：[https://medium.freecodecamp.org/closures-vuejs-higher-order-functions-emojipicker-f10d3c249a12](https://medium.freecodecamp.org/closures-vuejs-higher-order-functions-emojipicker-f10d3c249a12)



## 函数作用域

尽管闭包是 JavaScript 最强大的概念之一，但它们很容易被许多人忽视。



然而，了解闭包是非常重要的，因为它们定义了函数在执行过程中可以访问哪些变量。更准确地说，闭包定义了一个函数从它自己的作用域开始，通过所有父作用域，直到全局作用域，可以访问哪些作用域。



要真正掌握闭包，首先必须对作用域有一个扎实的理解。您可能已经亲身体验过作用域的影响。每次执行函数时，都会创建一个作用域。每当您在该函数中创建变量时，这些变量只能从函数本身中访问。



当函数完成时(达到 `return` 语句 或 `}` )，所有这些变量都被销毁。下次执行该函数时，将执行相同的过程。



让我们看下面的例子来说明这个概念。

```javascript
function square(x){
  const squaredX = x  x;
  console.log(squaredX); // 25
  return squaredX;
}

const squaredA = square(5);

console.log(squaredA); // 25 
console.log(squaredX); // ReferenceError: squaredX is not defined
```



将作用域视为只有该函数中的代码可以访问的临时上下文。



虽然作用域的生命周期非常有限，受函数执行所需时间的限制，但与此相反，在最初定义函数时，已经创建了函数的闭包。它也将在执行完成后保留。



## 闭包

如前所述，闭包负责定义在函数执行范围内哪些变量是可访问的。理解闭包不提供可用变量的副本而是引用它们是非常重要的。如果您不熟悉 JavaScript 的引用，请查看这篇[文章](https://codeburst.io/explaining-value-vs-reference-in-javascript-647a975e12a0)。

```javascript
let globalString = 'A'

function hello(){
  const localString = 'C'
  console.log(globalString, localString);
}

hello(); // A C

globalString = "B";

hello(); // B C
```



这个例子看起来可能很熟悉，它没有什么特别之处。这解释了为什么我们几乎没有意识到闭包有多强大，因为通常只在全局范围内定义函数(而不是函数作用域内)。



然而，当在另一个函数的作用域内定义函数时，闭包提供强大的技术和模式支持。在面向对象的体系结构中，闭包提供了一种简单而有效的方法来建立**数据私有**。在功能更强的体系结构中，闭包对于**高阶函数(higher order functions)**和**偏函数应用(partial application)**以及**柯里化(currying)**这两种更高级的编程技术是必不可少的。



## 高阶函数

对其他函数进行操作的函数，将它们作为参数，或者通过返回它们，被称为高阶函数函数。



让我们把所有 `.js` 文件通过下一代 JavaScript 转译器 [Babel](http://babeljs.io/) 运行来保持所有代码的现代化 ：

```javascript
function createMultiplier(multiplier){
  return function(value){
    return value * multiplier;
  }
}

const multiplyBy2 = createMultiplier(2);

console.log(multiplyBy2(5)); //10
```



在这里，我们终于可以体验闭包的力量。即使 `createMultiplier` 已经成功完成，我们仍然可以访问它的初始 `multiplier` 属性。



这是可能的，因为闭包保留变量的引用。这些甚至可以跨越多个作用域，并且在上下文终止时不会被破坏。这样，我们仍然可以访问局部变量的特定实例。



## 数据私有

```javascript
function privateVariables(){
  let privateValue = 100;
  return {
    get: function(){
      return privateValue;
    }
  }
}

console.log(privateVariables.get()); //100
```



为什么闭包使我们能够实现数据私有？



我们可以简单地封闭变量，只允许包含(外部)函数范围内的函数访问它们。



除非通过对象的特权方法，否则不能从外部范围获取数据。这种模式也允许我们进入面向接口编程，而不是实现本身。



## 结论

因为闭包，我们可以在相关函数可能已经终止时访问父作用域的变量。



我们可以在 VueJS 中使用 JavaScript 的这种行为来动态构建基于动态参数的方法，而不会用各种各样的变量和方法污染我们的组件。



感谢阅读 🙌