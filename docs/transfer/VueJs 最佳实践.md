---
title: VueJs 最佳实践
---

# VueJs 最佳实践

原文地址：[https://blog.usejournal.com/vue-js-best-practices-c5da8d7af48d](https://blog.usejournal.com/vue-js-best-practices-c5da8d7af48d)

各位开发的小伙伴大家好！



在 [VueJs 文档](https://vuejs.org/v2/guide/)和网络上研究了一段时间后，我已经创建了一个最佳实践和风格指南的列表，以更正确或更普遍接受的方式使用 VueJs。



以下几点与功能/优化有关，其他是 VueJs 命名约定和元素排序。更详细的信息可以在摘要中的链接中找到。



## 在组件销毁时通过 $off 清除事件监听器

当通过 `$on` 监听事件时，我们应该永远记住在 `destroyed()` 方法中通过 `$off` 删除监听者。这防止了我们内存泄漏。



## 事件名称始终使用短横线命名法

当发出/监听自定义事件时，我们应该总是使用短横线命名法。为什么呢？因为无论如何，这些事件都会自动转换成短横线命名。我们永远不会监听用驼峰或帕斯卡命名法命名的事件，因此，把事件名声明为和我们要监听它的方式一样：使用短横线命名法。



```
// Emitting
this.$emit('my-event') // instead of myEvent
// Listening
v-on:my-event
```



## 避免在 created 和 watch 中调用相同的方法

如果我们需要在组件初始化和属性更改时触发一种方法，通常的做法是这样做：

```
watch: {
  myProperty() {
    this.doSomething();
  }
},
created() {
  this.doSomething();
},
methods: {
  doSomething() {
     console.log('doing something...');
  }
},
```

尽管看起来不错，这里使用 `created ( )` 是多余的。我们可以将所有的功能都放在 `watch` 属性中，从而避免在 `created ( )` 中重复代码，并在组件实例化时触发它。例如：

```
watch: {
  myProperty: {
    immediate: true, // forcing handler on initial status
    handler() {
      this.doSomething();
    }
  }
},
methods: {
  doSomething() {
     console.log('doing something...');
  }
},
// Even better solution
watch: {
  myProperty: {
    immediate: true, // forcing handler on initial status
    handler() {
      console.log('doing something...'); // No need to declare a function on methods for 1 use case
    }
  }
},
```

 ## 在 v-for 循环中始终使用 :key

总是在模板循环中添加一个 : key 是一种常见的最佳做法。没有 : key 的 v-for 会导致很难找到错误，尤其是在动画中。



## 将$ _用于 mixins 属性

Mixins 是一种很好的方法，可以将重复的代码放入单个块中，并根据需要多次导入，但是(而且是一个很大的但是)，这可能会导致几个问题。在这里，我们将讨论重叠属性的问题。



当我们将 mixin 导入我们的组件时，我们正在将 mixin 代码与我们的组件代码合并，现在，同名的属性怎么办？组件将永远占据上风，组件的属性具有更高的优先级。如果我想让我的 mixin 更有优先权呢？你不能分配优先级，但是你可以通过选择正确的**命名约定**来避免属性重叠甚至覆盖。



为了区分 mixin 属性和组件属性，我们使用$ _。为什么是这些符号？有几个原因:

1. 来自 VueJs 风格指南的约定
2. _是为 Vue 的私有属性预留的
3. $是为 Vue 的生态系统预留的



在 [VueJs 风格指南](https://vuejs.org/v2/style-guide/#Private-property-names-essential)中，你会发现他们建议添加mixin的名称，例如: `$_myMixin_updateUser`。



我发现添加 mixin 名称会让可读性更容易混淆。但是这也取决于混入、情况和开发者。



通过添加一个简单的 `$_`， 比如 `$_updateUser`，我发现代码可读性更强，可以轻松区分组件和 Mixin。



## 切勿在与 v-for 相同的元素上使用 v-if

这是一个性能杀手，列表越大，这种糟糕的做法会给性能带来越大的影响。



让我们用代码来解释，想象下面的案例场景:

```
<ul>
  <li
    v-for="game in games"
    v-if="game.isActive"
    :key="game.slug"
  >
    {{ game.title }}
  <li>
</ul>
```

将按如下方式进行转换：

```
this.games.map(function (game) {
  if (game.isActive) {
    return game.title
  }
})
```

我们可以在这里看到，我们必须遍历整个 `games` 列表，不管 `game` 是否已经改变。



在其他框架中，比如 Angular，这种情况就不会编译( `*ngIf` 不能在有 `*ngFor` 的同一元素中进行编译)。