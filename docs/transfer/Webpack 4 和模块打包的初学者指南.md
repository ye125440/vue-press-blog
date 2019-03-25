# Webpack 4 和模块打包的初学者指南

原文地址：https://www.sitepoint.com/beginners-guide-webpack-module-bundling/



**[Webpack 4](https://github.com/webpack/webpack) 的官方文档自述称：**

> Webpack 是一个模块管理器。它的主要目的是聚合在浏览器中使用的 JavaScript 文件，而且它也能够转换、聚合或打包几乎任何资源或资产。



[Webpack](https://webpack.js.org/) 已经成为现代 web 开发最重要的工具之一。它主要是一个针对你的 JavaScript 的模块聚合器，但是它可以学会转换你所有的前端资源，比如 HTML，CSS，甚至图像。它可以让你更好地控制你的应用程序发出的 HTTP 请求数量，并允许你使用其他类型的资源(例如 Pug、Sass 和 ES8 )。Webpack还允许您轻松使用 npm 中的包。



本文面向那些对 Webpack 不熟悉的人，将涵盖初始设置和配置、modules、loaders、plugins、代码分割和模块热替换。如果你觉得视频教程很有帮助，我可以强烈推荐 Glen Maddern 的 [Webpack from First Principles](https://www.youtube.com/watch?v=WQue1AN93YU)，作为理解 Webpack 特殊之处的起点。它现在有点旧了，但是原理仍然是一样的，这是一个很好的介绍。



继续跟进，您需要[安装 Node.js](https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/)。您也可以[从我们的 GitHub 仓库下载演示应用程序](https://github.com/markbrown4/webpack-demo)。



## 设置

让我们用 npm 初始化一个新项目，并安装 webpack 和 webpack-cli(*1) :

```shell
mkdir webpack-demo && cd webpack-demo
npm init -y
npm install --save-dev webpack webpack-cli
```

接下来，我们将创建以下目录结构和内容：

```bash
  webpack-demo
  |- package.json
+ |- webpack.config.js
+ |- /src
+   |- index.js
+ |- /dist
+   |- index.html
```

**dist/index.html**

```html
<!doctype html>
<html>
  <head>
    <title>Hello Webpack</title>
  </head>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
```

**src/index.js**

```javascript
const root = document.createElement("div")
root.innerHTML = `<p>Hello Webpack.</p>`
document.body.appendChild(root)
```

**webpack.config.js**

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

这告诉 Webpack 编译我们的入口路径 `src/index.js` 中的代码，并在 `/dist/bundle.js` 中输出一个包。让我们添加一个运行 Webpack 的 [npm 脚本](https://docs.npmjs.com/misc/scripts)。



**package.json**

```diff
  {
    ...
    "scripts": {
-     "test": "echo \"Error: no test specified\" && exit 1"
+     "develop": "webpack --mode development --watch",
+     "build": "webpack --mode production"
    },
    ...
  }
```

使用 `npm run develop` 命令，我们可以创建第一个包！

```bash
Asset      Size      Chunks           Chunk Names
bundle.js  2.92 KiB  main  [emitted]  main
```

现在，你应该可以在浏览器中加载 `dist/index.html`，并得到“Hello Webpack”的问候。



打开 `dist/bundle.js` 看看 Webpack 做了什么。顶部是 Webpack 的模块引导代码，底部是我们的模块。你可能目前还没有感受到惊喜，但是如果你已经走了这么远，你现在可以开始使用ES模块，并且 Webpack 将能够产生一个可以在所有浏览器中工作的生产包。



用 `Ctrl + C` 重新启动构建，并运行 `npm run build` 以在生产模式下编译我们的包。

```bash
Asset      Size       Chunks           Chunk Names
bundle.js  647 bytes  main  [emitted]  main
```

请注意，包大小已经从 **2.92 KiB** 下降到 **647 bytes**(*2)。

再看看 `dist/bundle.js`，你会看到一堆丑陋杂乱的代码。我们的包已经用UglifyJS缩小了：代码将运行完全相同，但是它以尽可能小的文件大小完成。

- `--mode development` 优化构建速度和调试。
- `--mode production` 优化运行时的执行速度和输出文件大小。



## 模块

使用 ES 模块，你可以把你的大程序分成许多小的、独立的程序。

开箱即用，Webpack 知道如何使用 `import` 和 `export` 语句使用 ES 模块。例如，现在让我们通过安装 [lodash-es](https://lodash.com/) 和添加第二个模块来尝试一下：

```bash
npm install --save-dev lodash-es
```

**src/index.js**

```javascript
import { groupBy } from "lodash-es"
import people from "./people"

const managerGroups = groupBy(people, "manager")

const root = document.createElement("div")
root.innerHTML = `<pre>${JSON.stringify(managerGroups, null, 2)}</pre>`
document.body.appendChild(root)
```

**src/people.js**

```javascript
const people = [
  {
    manager: "Jen",
    name: "Bob"
  },
  {
    manager: "Jen",
    name: "Sue"
  },
  {
    manager: "Bob",
    name: "Shirley"
  }
]

export default people
```

运行 `npm run develop` 来启动 Webpack 并刷新 `index.html`。屏幕上应该会显示按 manager 属性分组的一系列人员。



*注意：*没有像`'es-lodash'`这样的相对路径的导入是从 npm 安装到 `/node_modules` 的模块。您自己的模块将总是需要一个相对路径，如`'./people'`，因为这是你区分他们的方法。



请注意，在控制台中，我们的包大小已经增加到 **1.41 MiB**！这值得关注，尽管在这种情况下没有理由担心。使用 `npm run build` 在生产模式下进行编译，将从包中移除 lodash-es 中所有未使用的 lodash 模块。这种删除未使用的导入的过程被称为 **tree-shaking**，这是您从 Webpack 中免费获得的。

```bash
> npm run develop

Asset      Size      Chunks                  Chunk Names
bundle.js  1.41 MiB  main  [emitted]  [big]  main
```

```bash
> npm run build

Asset      Size      Chunks        Chunk Names
bundle.js  16.7 KiB  0  [emitted]  main
```



## 加载器

加载器允许您在文件导入时对其运行预处理程序。这允许您聚合 JavaScript 之外的静态资源，但是让我们先看看加载 .`js` 模块时可以做些什么。



让我们把所有 `.js` 文件通过下一代 JavaScript 转译器 [Babel](http://babeljs.io/) 运行来保持所有代码的现代化 ：

```bash
npm install --save-dev "babel-loader@^8.0.0-beta" @babel/core @babel/preset-env
```

**webpack.config.js**

```javascript
  const path = require('path')

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.js$/,
+         exclude: /(node_modules|bower_components)/,
+         use: {
+           loader: 'babel-loader',
+         }
+       }
+     ]
+   }
  }
```

**.babelrc**

```javascript
{
  "presets": [
    ["@babel/env", {
      "modules": false
    }]
  ],
  "plugins": ["syntax-dynamic-import"]
}
```

这份配置(*3)防止了 Babel 将 `import` 和 `export` 语句转译到 ES5 中，并启用了动态导入——我们将在后面的代码拆分一节中讨论这一点。

我们现在可以自由使用现代语言特性，它们将被编译成在所有浏览器中运行的 ES5。



### Sass

加载器可以链接在一起成为一系列转换。是从我们的 JavaScript 中导入 Sass 是演示这是如何工作的一个好方法：

```bash
npm install --save-dev style-loader css-loader sass-loader node-sass
```

**webpack.config.js**

```javascript
  module.exports = {
    ...
    module: {
      rules: [
        ...
+       {
+         test: /\.scss$/,
+         use: [{
+           loader: 'style-loader'
+         }, {
+           loader: 'css-loader'
+         }, {
+           loader: 'sass-loader'
+         }]
+       }
      ]
    }
  }
```

这些加载器以相反的顺序进行处理：

- `sass-loader` 将 Sass 转换为 CSS。
- `css-loader` 将 CSS 解析成 JavaScript 并解析任何依赖关系。
- `style-loader` 输出我们的 CSS 到 document 的 `<style>` 标签中。

你可以把这些看作函数调用。一个加载器的输出作为输入馈送到下一个:

```javascript
styleLoader(cssLoader(sassLoader("source")))
```

让我们添加一个 Sass 源文件并导入为一个模块。

**src/style.scss**

```scss
$bluegrey: #2b3a42;

pre {
  padding: 8px 16px;
  background: $bluegrey;
  color: #e1e6e9;
  font-family: Menlo, Courier, monospace;
  font-size: 13px;
  line-height: 1.5;
  text-shadow: 0 1px 0 rgba(23, 31, 35, 0.5);
  border-radius: 3px;
}
```

**src/index.js**

```javascript
  import { groupBy } from 'lodash-es'
  import people from './people'

+ import './style.scss'

  ...
```

用 `Ctrl + C` 和 `npm run develop` 重新启动构建。在浏览器中刷新 `index.html`，你会看到一些样式。



### JS 中的 CSS

我们刚刚从 JavaScript 中导入了一个 Sass 文件，作为一个模块。 

打开 `dist/bundle.js` 并搜索“pre {”。事实上，我们的 Sass 已经被编译成一串 CSS，并作为一个模块保存在我们的包中。当我们将该模块导入到我们的 JavaScript 中时，`style-loader` 将该字符串输出到内嵌的`<style>` 标签中。

**为什么要做这样的事？**

我不会在这里深入探讨这个话题，但有几个理由需要考虑：

- 您可能希望包含在项目中的一个 JavaScript 组件可能依赖于其他资产来正常运行(HTML、CSS、图像、SVG )。如果这些都可以捆绑在一起，就更容易导入和使用。
- 死代码消除：当一个 JS 组件不再被您的代码导入时，该 CSS 也将不再被导入。生成的包将只包含做某事的代码。
- CSS 模块：CSS 的全局命名空间使得很难相信对你的 CSS 的改变不会有任何副作用。CSS 模块在默认情况下通过使 CSS 成为本地的，并暴露您可以在 JavaScript 中引用的唯一类名来改变这一点。
- 通过以巧妙的方式聚合/拆分的代码来减少 HTTP 请求的数量。

### 图像

我们要看的最后一个加载器例子是用 `file-loader` 处理图像。

在标准的 HTML 文档中，当浏览器遇到 `img` 标签或具有 `background-image`  属性的元素时，会获取图像。使用Webpack，您可以在小图像的情况下通过将图像源存储为 JavaScript 中的字符串来优化这一点。通过这样做，您可以预加载它们，浏览器以后就不必用单独的请求来获取它们了：

```bash
npm install --save-dev file-loader
```

**webpack.config.js**

```javascript
  module.exports = {
    ...
    module: {
      rules: [
        ...
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           {
+             loader: 'file-loader'
+           }
+         ]
+       }
      ]
    }
  }
```

使用以下命令下载[测试图像](https://raw.githubusercontent.com/sitepoint-editors/webpack-demo/master/src/code.png)：

```bash
curl https://raw.githubusercontent.com/sitepoint-editors/webpack-demo/master/src/code.png --output src/code.png
```

用 `Ctrl + C` 和 `npm run develop` 重新启动构建，您现在可以将图像作为模块导入了！

**src/index.js**

```javascript
  import { groupBy } from 'lodash-es'
  import people from './people'

  import './style.scss'
+ import './image-example'

  ...
```

**src/image-example.js**

```javascript
import codeURL from "./code.png"

const img = document.createElement("img")
img.src = codeURL
img.style = "background: #2B3A42; padding: 20px"
img.width = 32
document.body.appendChild(img)
```

这将包括一个图像，其中 `src` 属性包含图像本身的[数据 URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) ：

```html
<img src="data:image/png;base64,iVBO..." style="background: #2B3A42; padding: 20px" width="32">
```

我们 CSS 中的背景图像也由 `file-loader` 处理。

**src/style.scss**

```scss
  $bluegrey: #2b3a42;

  pre {
    padding: 8px 16px;
-   background: $bluegrey;
+   background: $bluegrey url("code.png") no-repeat center center / 32px 32px;
    color: #e1e6e9;
    font-family: Menlo, Courier, monospace;
    font-size: 13px;
    line-height: 1.5;
    text-shadow: 0 1px 0 rgba(23, 31, 35, 0.5);
    border-radius: 3px;
  }
```

请参见文档中加载器的更多示例：

- [Loading Fonts](https://webpack.js.org/guides/asset-management/#loading-fonts)
- [Loading Data](https://webpack.js.org/guides/asset-management/#loading-data)



### 依赖图

现在，您应该能够看到加载器如何帮助在您的资产之间建立依赖关系树。这就是 Webpack 主页上的图片所展示的。

![JS requires SCSS requires CSS requires PNG](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2017/01/1484692838webpack-dependency-tree.png)

虽然 JavaScript 是入口点，但是 Webpack 意识到您的其他资产类型——如 HTML、CSS 和 SVG——都有它们自己的依赖关系，这应该被视为构建过程的一部分。



## 代码分割

来自 [Webpack 文档](https://webpack.js.org/guides/code-splitting/)：

> 代码分割是 Webpack 最引人注目的特性之一。这个特性允许您将代码分成不同的包，然后可以按需或并行加载。它可用于实现更小的包和控制资源负载优先级，如果使用正确，这将对负载时间产生重大影响（好的方面）。



到目前为止，我们只看到了一个入口点——`src/index.js`——和一个输出包——`dist/bundle.js`。当你的应用程序增长时，你需要把它分开，这样整个代码库就不会在开始时被下载。一个好的方法是使用[代码拆分](https://webpack.js.org/guides/code-splitting/)和[惰性加载](https://webpack.js.org/guides/lazy-loading/)来按需获取代码路径需要的东西。

让我们通过添加一个“chat”模块来演示这一点，当有人与它交互时，这个模块被获取并初始化。我们将创建一个新的入口点并给它一个名称，我们还将使输出的文件名动态化，因此每个块的文件名都不同。



**webpack.config.js**

```javascript
   const path = require('path')

  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     app: './src/app.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    ...
  }
```

**src/app.js**

```javascript
import './app.scss'

const button = document.createElement("button")
button.textContent = 'Open chat'
document.body.appendChild(button)

button.onclick = () => {
  import(/* webpackChunkName: "chat" */ "./chat").then(chat => {
    chat.init()
  })
}
```

**src/chat.js**

```javascript
import people from "./people"

export function init() {
  const root = document.createElement("div")
  root.innerHTML = `<p>There are ${people.length} people in the room.</p>`
  document.body.appendChild(root)
}
```

**src/app.scss**

```scss
button {
  padding: 10px;
  background: #24b47e;
  border: 1px solid rgba(#000, .1);
  border-width: 1px 1px 3px;
  border-radius: 3px;
  font: inherit;
  color: #fff;
  cursor: pointer;
  text-shadow: 0 1px 0 rgba(#000, .3), 0 1px 1px rgba(#000, .2);
}
```

*注意：*尽管`/ * webpackChunkName * /`注释为包命名，但该语法不是特定于 Webpack 的。这是[动态导入的建议语法](https://github.com/tc39/proposal-dynamic-import)，预期在浏览器中直接支持。

让我们运行 `npm run build`，看看这会产生什么结果：

```bash
Asset           Size       Chunks        Chunk Names
chat.bundle.js  377 bytes  0  [emitted]  chat
app.bundle.js   7.65 KiB   1  [emitted]  app
```

随着我们的入口包发生了变化，我们也需要更新我们的路径。

**dist/index.html**

```html
  <!doctype html>
  <html>
    <head>
      <title>Hello Webpack</title>
    </head>
    <body>
-     <script src="bundle.js"></script>
+     <script src="app.bundle.js"></script>
    </body>
  </html>
```

让我们从 dist 目录启动一个服务，以查看它的运行情况：

```bash
cd dist
npx serve
```

在浏览器中打开 http://localhost:5000，看看会发生什么。最初只获取 `bundle.js`。当点击按钮时，chat 模块被导入并初始化。

![Network requests showing lazy loading of chunks](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2018/03/1521906882lazy-loading.png)

只需很少的努力，我们已经在应用程序中添加了动态代码分割和模块的惰性加载。这是构建高性能网络应用的一个很好的起点。



## 插件

当加载器在单个文件上操作转换时，插件在更大的代码块上操作。

现在我们正在聚合我们的代码、外部模块和静态资产，我们的包将会快速增长。插件在这里帮助我们以巧妙的方式分割代码，并优化产品。

不知不觉中，我们实际上已经使用了许多[默认的“mode”附带的 Webpack 插件](https://webpack.js.org/concepts/mode/#usage)。

**development**

- 为 `process.env.NODE_ENV` 提供值 “development”
- NamedModulesPlugin

**production**

- 为 `process.env.NODE_ENV` 提供值 “production”
- UglifyJsPlugin
- ModuleConcatenationPlugin
- NoEmitOnErrorsPlugin

### Production

在添加额外的插件之前，我们首先将我们的配置分开，以便我们可以应用特定于每个环境的插件。

将 `webpack.config.js` 重命名为 `webpack.common.js`，并为 development 和 production 模式各添加一个配置文件。

```diff
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
```

我们将使用 `webpack-merge` 把我们的公共配置与特定环境的配置相结合：

```bash
npm install --save-dev webpack-merge
```

**webpack.dev.js**

```javascript
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development'
})
```

**webpack.prod.js**

```javascript
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production'
})
```

**package.json**

```json
   "scripts": {
-    "develop": "webpack --watch --mode development",
-    "build": "webpack --mode production"
+    "develop": "webpack --watch --config webpack.dev.js",
+    "build": "webpack --config webpack.prod.js"
   },
```

### 拆分 CSS

打包用于生产环境使用时，使用 [ExtractTextWebpackPlugin](https://webpack.js.org/plugins/extract-text-webpack-plugin) 将您的 CSS 与 JavaScript 分开被认为是最佳实践。

目前的 `.scss` 加载器非常适合开发环境，所以我们将把它们从 `webpack.common.js` 移到 `webpack.dev.js` 中，并只将 `ExtractTextWebpackPlugin` 添加到 `webpack.prod.js` 中。

```bash
npm install --save-dev extract-text-webpack-plugin@4.0.0-beta.0
```

**webpack.common.js**

```javascript
  ...
  module.exports = {
    ...
    module: {
      rules: [
        ...
-       {
-         test: /\.scss$/,
-         use: [
-           {
-             loader: 'style-loader'
-           }, {
-             loader: 'css-loader'
-           }, {
-             loader: 'sass-loader'
-           }
-         ]
-       },
        ...
      ]
    }
  }
```

**webpack.dev.js**

```javascript
  const merge = require('webpack-merge')
  const common = require('./webpack.common.js')

  module.exports = merge(common, {
    mode: 'development',
+   module: {
+     rules: [
+       {
+         test: /\.scss$/,
+         use: [
+           {
+             loader: 'style-loader'
+           }, {
+             loader: 'css-loader'
+           }, {
+             loader: 'sass-loader'
+           }
+         ]
+       }
+     ]
+   }
  })
```

**webpack.prod.js**

```javascript
  const merge = require('webpack-merge')
+ const ExtractTextPlugin = require('extract-text-webpack-plugin')
  const common = require('./webpack.common.js')

  module.exports = merge(common, {
    mode: 'production',
+   module: {
+     rules: [
+       {
+         test: /\.scss$/,
+         use: ExtractTextPlugin.extract({
+           fallback: 'style-loader',
+           use: ['css-loader', 'sass-loader']
+         })
+       }
+     ]
+   },
+   plugins: [
+     new ExtractTextPlugin('style.css')
+   ]
  })
```

让我们比较两个构建脚本的输出：

```bash
> npm run develop

Asset           Size      Chunks           Chunk Names
app.bundle.js   28.5 KiB  app   [emitted]  app
chat.bundle.js  1.4 KiB   chat  [emitted]  chat
```

```bash
> npm run build

Asset           Size       Chunks        Chunk Names
chat.bundle.js  375 bytes  0  [emitted]  chat
app.bundle.js   1.82 KiB   1  [emitted]  app
style.css       424 bytes  1  [emitted]  app
```

既然我们的 CSS 是从我们的 JavaScript 包中提取出来用于生产的，我们需要从我们的 HTML 通过 `<link>` 标签引用它。

**dist/index.html**

```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Code Splitting</title>
+     <link href="style.css" rel="stylesheet">
    </head>
    <body>
      <script type="text/javascript" src="app.bundle.js"></script>
    </body>
  </html>
```

这允许在浏览器中并行下载 CSS 和 JavaScript，因此加载速度比单个包快。它还允许在 JavaScript 完成下载之前显示样式。

### 生成 HTML

每当我们的输出改变时，我们必须不断更新 `index.html` 来引用新的文件路径。这正是 `html-webpack-plugin` 能为我们自动完成的。

我们不妨同时添加 `clean-webpack-plugin` ，以便在每次构建之前清除我们的 `/dist` 目录。

```bash
npm install --save-dev html-webpack-plugin clean-webpack-plugin
```

**webpack.common.js**

```javascript
  const path = require('path')
+ const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    ...
+   plugins: [
+     new CleanWebpackPlugin(['dist']),
+     new HtmlWebpackPlugin({
+       title: 'My killer app'
+     })
+   ]
  }
```

现在每次我们构建的时候，dist 目录都会被清空。我们现在也将看到输出的 index.html，以及到我们的入口包的正确路径。

 运行 `npm run develop` 会产生以下结果:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>My killer app</title>
  </head>
  <body>
    <script type="text/javascript" src="app.bundle.js"></script>
  </body>
</html>
```

而 `npm run build` 会产生这个：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>My killer app</title>
    <link href="style.css" rel="stylesheet">
  </head>
  <body>
    <script type="text/javascript" src="app.bundle.js"></script>
  </body>
</html>
```



## Development

webpack-dev-server 为您提供了一个简单的 web 服务器，并为您提供了实时重载，因此您不需要手动刷新页面来查看更改。

```bash
npm install --save-dev webpack-dev-server
```

**package.json**

```diff
  {
    ...
    "scripts": {
-     "develop": "webpack --watch --config webpack.dev.js",
+     "develop": "webpack-dev-server --config webpack.dev.js",
    }
    ...
  }
> npm run develop

 ｢wds｣: Project is running at http://localhost:8080/
 ｢wds｣: webpack output is served from /
```

在浏览器中打开 http://localhost:8080/ 并对其中一个 JavaScript 或 CSS 文件进行更改。您应该会看到它自动构建和刷新。



### HotModuleReplacement

`HotModuleReplacement` 插件比实时重载更进一步，在运行时无需刷新即可交换模块。如果配置正确，这将在开发单页应用程序的过程中节省大量时间。在页面中有很多状态的地方，可以对组件进行增量更改，只有更改后的模块才会被替换和更新。

**webpack.dev.js**

```diff
+ const webpack = require('webpack')
  const merge = require('webpack-merge')
  const common = require('./webpack.common.js')

  module.exports = merge(common, {
    mode: 'development',
+   devServer: {
+     hot: true
+   },
+   plugins: [
+     new webpack.HotModuleReplacementPlugin()
+   ],
    ...
  }
```

现在，我们需要*接受(accept)*代码中已更改的模块来重新初始化。

**src/app.js**

```diff
+ if (module.hot) {
+   module.hot.accept()
+ }

  ...
```

*注意：*启用热模块更换时，development 模式时 `module.hot` 设置为 `true`，production 时设置为 `false`，因此这些模块将从包中剥离。

重新启动构建，看看当我们执行以下操作时会发生什么：

- 单击打开 chat
- 添加一个新 person 到 `people.js` 模块中
- 再次单击打开 chat

![Here's what's happening:](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2018/03/1521906879hmr.png)

事情是这样的：

1. 当 *Open chat* is 被点击时，`chat.js` 模块被获取并初始化
2. HMR 检测到 `people.js` 何时被修改
3.  `index.js` 中的 `module.hot.accept()` 导致由该条目块加载的所有模块被替换
4. 当 *Open chat* 被再次点击时， `chat.init()` 使用来自更新模块的代码运行。



### CSS 替换

让我们将按钮颜色改为红色，看看会发生什么：

```diff
  button {
    ...
-   background: #24b47e;
+   background: red;
    ...
  }
```

![img](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2018/03/1521906881hmr2.png)

现在我们可以看到我们样式的即时更新，而不会失去任何状态。这是一个大大改进的开发人员体验！感觉就像是未来。



## HTTP/2

使用像 Webpack 这样的模块管理器的一个主要好处是，它可以让您控制资产是如何构建的，然后在客户端获取的，从而帮助您提高性能。多年来，串联文件以减少需要在客户机上发出的请求数量被认为是[最佳做法](https://developer.yahoo.com/performance/rules.html)。这仍然有效，但是现在 [HTTP/2 允许在一个请求中传递多个文件](HTTP/2 允许在一个请求中传递多个文件)，所以串联不再是一个万能药(silver bullet)。你的应用程序实际上可能会受益于单独缓存许多小文件。然后，客户端可以获取单个已更改的模块，而不必再次获取大部分内容相同的整个包。



Webpack 的创建者 [Tobias Koppers](https://twitter.com/wSokra) 写了一篇内容丰富的文章，解释为什么聚合仍然很重要，即使是在 HTTP/2 时代。



## Over to You

我希望你已经认可这个 Webpack 的介绍很有帮助，并且能够开始使用它达到很好的效果。围绕 Webpack 的配置、加载器和插件可能需要一点时间，但是学习这个工具是如何工作的将会有回报。



Webpack 4 的文档目前正在编写中，但是已经整理好了。我强烈建议阅读[概念](https://webpack.js.org/concepts/)和[指南](https://webpack.js.org/guides/)以获取更多信息。这里还有几个你可能感兴趣的话题：

- [Source Maps for development](https://webpack.js.org/guides/development/#using-source-maps)
- [Source Maps for production](https://webpack.js.org/guides/production/#source-mapping)
- [Cache busting with hashed filenames](https://webpack.js.org/guides/caching/)
- [Splitting a vendor bundle](https://webpack.js.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk)



Webpack 4 是您选择的模块管理器吗？请在下面的评论中告诉我。



*1：安装 npm 的命令 `--save-dev` 可以缩写为 `-D`

*2：因为程序版本的原因，我自己在按照以上操作后得到的包大小和上文中有些许出入，数量级没有差距，production 模式打出的包大小要比 development 模式的小得多。

*3：按照这样配置 `.babelrc` 后运行打包命令会报 `"syntax-dynamic-import"` 模块未找到的相关错误，`npm install syntax-dynamic-import` 后能解决。

