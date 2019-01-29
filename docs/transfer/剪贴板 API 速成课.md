---
title: 剪贴板 API 速成课
---

# 剪贴板 API 速成课

原文地址：[https://frontendnews.io/editions/2018-08-01-copy-and-paste-clipboard-api](https://frontendnews.io/editions/2018-08-01-copy-and-paste-clipboard-api)

## 人人皆知的快捷键

不是所有人都喜欢用快捷键操作电脑。有一大群用户和程序员都依赖图形菜单和按钮。然而，如果有什么快捷键组合是大家都知道的，那就是 `Cmd + C`，`Cmd + V`。是的，当然，在 Windows 上是 `Ctrl + C`，`Ctrl + V`。**但是当你复制的时候究竟发生了什么呢？**

## 剪贴板是一个数据缓冲区

每个主要的操作系统都有一个“剪贴板”。这是一个用于短期存储的数据缓冲区，有时称为“粘贴缓冲区”。新的复制或剪切命令将替换缓冲区中的先前值。几乎所有程序都可以访问这个缓冲区。否则，当我们碰到 `Cmd + v` 时什么也没发生，我们会很恼火。

![](Untitled-918261ad-ca4f-4600-9b96-6b1065c0666f.png)

## 自动复制复杂的文本可以有良好的用户体验

通常在网站上，我们需要向用户呈现特殊的代码或文本。这段文字通常很长，看起来简直像胡言乱语。用户倾向于自己复制它。然而，如果他们在开头或结尾遗漏了一个字符怎么办？如果他们抓取了太多空白而你没有修剪空白怎么办？如果他们困惑于要复制什么呢？犯错的空间太大了。一个很好的解决方案是自动将这些文本复制到他们的剪贴板上。**但是省事的地方，通常不省心。**

![](Untitled-0750c133-30bd-4f98-a570-65880ba01a25.png)

## 剪贴板存在安全问题

当用户完全控制剪贴板时，没有什么问题。然而，当一个应用或程序访问剪贴板时会发生什么呢？我打赌你可以开始想象一些糟糕的场景。如果一个应用偷偷地轮询你的剪贴板并将结果发送到服务器会怎么样？那些有潜在风险的敏感信息，如密码、银行账户或任何冗长的你不会考虑自己输入的安全令牌。**我们如何应对这种情况？**

## 安全策略使得浏览器上的复制和粘贴变得怪异

复制和粘贴操作在网络上有一段奇怪的历史。没有真正的标准。大多数浏览器已经确定了指令 `.execCommand('copy')`和指令 `.execCommand('paste')`。虽然这看起来很容易，但也有一些奇怪之处。

    const result = document.executeCommand('copy');

如果这是你第一次使用 `document.execCommand('copy')`，你可能会想知道“文本参数在哪里？"。你可能会激动不已，试着运行 `document.execCommand('paste')`，却发现它什么也没做。 没有一些额外的代码工作，你不能直接指定你想添加到剪贴板上的文本。你当然不能访问剪贴板上的任何内容。你需要遵守一些规则。

## 使用  `executeCommand('paste')` 访问剪贴板的规则

如果您想用 `document.execCommand('copy')`  复制文本: 

1. 内容必须存在于 DOM 中。
2. 用户需要触发事件( Firefox )
3. 复制的文本是用户选择的文本

Chrome 不需要用户触发事件，但是在 Firefox 中需要。

    const button = document.querySelector('#btnCopy');
    button.addEventListener('click', event => {
      console.log(document.execCommand('copy'));
    });

如果您想复制不在 DOM 中的文本，该怎么办？你可以注入该文本。

    const button = document.querySelector('#btnCopy');
    button.addEventListener('click', event => {
      const text = 'Hey look, this text is now in the DOM!';
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.value = text;
      input.focus();
      input.select();
      console.log(document.execCommand('copy'));
    });

如果你的文本不在 DOM 中，那就在 DOM 中创建它。上面的代码片段创建了一个输入元素，将其添加到 DOM 中，将文本插入到元素中，使它聚焦，选择它，最后复制它。

如果不像 `document.body.appendchild(input)`  中那样将子对象添加到 DOM 中，会发生什么？文本不会被复制。它不能只是一个独立的 DOM 节点，它需要在 DOM 中。

如果你想用 `document.execCommand('paste')`  直接从剪贴板上读取，你不能。它不适用于Chrome、Firefox、Edge 或 IE。要从剪贴板上获取数据，您必须监听粘贴事件。(这在 IE 中不支持。IE 剪贴板的情况也很奇怪。这是 window 对象上的一个属性，需要权限，但我们不会深入讨论这个内容)。

    document.addEventListener('paste', event => {
      const text = event.clipboardData.getData('text/plain');
      console.log(text);
    });

用户的粘贴操作会触发[剪贴板事件](https://www.w3.org/TR/clipboard-apis/#clipboardeventinit-clipboarddata)。在事件中，您可以访问剪贴板数据属性，这是一个[数据传输对象](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)。用正确的格式调用 `getData()` 会返回复制的文本。

这很棒，因为您没有对用户剪贴板的未授权访问。用户必须发起粘贴的操作。然而，有一个潜在的问题。对 `getData()` 的调用是同步的。

这对开发人员来说是个问题。如果他们粘贴了大量base64编码的图像会怎么样？或者其他一些惊人的大量数据？如果对粘贴的数据进行密集处理会怎么样？这可能会阻塞页面的主线程，从而显著地卡顿用户页面。

幸运的是，有一个即将到来的解决方案。这是一种全新的从剪贴板读写数据的方式。

## 异步剪贴板 API

这个新 API 比我们的老朋友 `document.execCommand('copy')` 有几个改进。

- 从剪贴板读取和写入是独立的命令
- 基于 `promise` 的异步剪贴板访问
- 基于权限。用户必须获取授权
- 不需要用户事件触发

注：到目前为止仅支持 Chrome。此 API 可能会发生变化。

    navigator.clipboard.writeText('whatever you need to copy').then(() => {
      console.log('Text copied!')           
    });

首次发出此命令时，系统会提示用户授予权限。由于这个 API 是异步的，当我们等待用户的许可时，主线程是畅通的。如果 API 是同步的，我们就完蛋了。

要从剪贴板中读取，请使用 `readText()` :

    navigator.clipboard.readText().then(text => {
      console.log(text);     
    });

就像以前一样，如果这是第一次，那么用户必须先授予权限，然后才能访问剪贴板。请记住，你无法确定当前剪贴板的值，数据可能很敏感。要求用户在必要时粘贴一个值仍然是一个好主意。

    document.addEventListener('paste', async event => {
      const text = await navigator.clipboard.readText();
      console.log(text);
    });

这个例子是对同步 `getData()` 传输方法的一大改进。用户必须授予权限，并且你具有异步访问权限。您可以更好地防止粘贴大量文本，并且更容易对粘贴的文本进行更密集的处理。

## 只有活动的选项卡可以访问剪贴板

用户总是会打开标签页。不受限制地使用键盘仍然是一个坏主意。你可以打开 [example.com](http://example.com) 的账单，把它放在那里一周。不要表现得好像你没有干过这样的事。在这段时间里，你会有各种各样的数据进出你的剪贴板。如果 [example.com](http://example.com) 轮询 `navigator.clipboard.readtext()` 方法会怎么样？那将是非常危险的，但这里有一个安全措施。

当用户切换到另一个选项卡时，您的站点不再有权访问剪贴板。这是一个很好的预防措施，但是它伴随着一个恼人的调试问题。当你在 Chrome 中打开 DevTools 时，DevTools 本身就变成了活动标签。`readText()` 或 `writeText()` 的 `promise` 会处于 `reject` 状态，你会很恼火，表情会像“这就是为什么我不使用全新的 APIs ”。诀窍是推迟调用，直到你可以点击回标签页。

    setTimeout(async () => {
      const text = await navigator.clipboard.readText();
      console.log(text);
    }, 4000);

这样也好不了多少，但会奏效的。这种怪异并不是异步剪贴板 API 的唯一缺点。

## 异步剪贴板 API 不提供用户选择的文本

使用 `document.execCommand('copy')` 将自动复制用户选择的文本。如果你需要这个功能，你必须自己得到所选的文本，并将其传递给 `writeText()`。这将需要[选择 API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)、[范围 API](https://developer.mozilla.org/en-US/docs/Web/API/Range) 和一些 DOM 遍历的组合。你将不得不处理跨一系列 DOM 元素组合文本节点的问题，这可不好玩。

## 了解有关异步剪贴板 API 的更多信息

传奇人物杰森·米勒写了[一篇令人惊叹的关于异步剪贴板 API 上文章](https://developers.google.com/web/updates/2018/03/clipboardapi)。这基本上是目前的标准资源。

## 对复制和粘贴负责

剪贴板访问对于用户体验来说是一个很好的工具，但是它有它的玫瑰刺。一些用户携带敏感数据，一些用户带来恶意数据。确保你负责任地处理用户的数据，并为那些讨厌的粘贴事件做好准备。