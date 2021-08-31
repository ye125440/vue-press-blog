module.exports = {
  title: '桂伦铝\'s blog',
  description: '我的个人博客',
  // head: [ // 注入到当前页面的 HTML <head> 中的标签
  //   ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  // ],
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  themeConfig: {
    nav:[ // 导航栏配置
      // {
      //   text: '前端',
      //   items: [
      //     { text: 'Javascript', link: '/javascript/' },
      //     { text: 'NodeJs', link: '/nodejs/' },
      //     { text: '思维导图', link: '/xmind/' },
      //   ]
      // },
      // { text: '翻译', link: '/transfer/' },
      { text: 'Javascript', link: '/javascript/' },
      { text: 'NodeJs', link: '/nodejs/' },
      { 
        text: '投资',
        items: [
          { text: '可转债', link: '/convertible-bond/'},
          { text: '港股打新', link: '/hk-ipo/'},
        ] },
      { text: 'Github', link: 'https://github.com/ye125440' }     
    ],
    // sidebar: 'auto', // 侧边栏配置
    sidebar: {
      // '/transfer/': [
      //   {
      //     title: '翻译文章',
      //     collapsable: false,
      //     children: [
      //       '发现 VueJS 中闭包的能力',
      //       'Webpack 4 和模块打包的初学者指南',
      //       'Google 对你了解有多少',
      //       '通过样例解释 JavaScript Prototype',
      //       'VueJs 最佳实践.md',
      //       '用信鸽解释 HTTPS.md',
      //       '剪贴板 API 速成课.md'
      //     ]
      //   }
      // ],
      '/javascript/': [
        {
          title: 'Javascript',
          collapsable: false,
          children: [
            'Javascript.md',
            'createApp.md',
            'h.md',
          ]
        }
      ],
      '/nodejs/': [
        {
          title: 'NodeJs',
          collapsable: false,
          children: [
            'NodeJs.md',
          ]
        }
      ],
      '/xmind/': [
        {
          title: '思维导图',
          collapsable: false,
          children: [
            'Iterator 思维导图.md',
            'Generator 思维导图.md',
          ]
        }
      ],
      '/hk-ipo/': [
        {
          title: '港股打新',
          collapsable: false,
          children: [
            '心玮医疗-B.md',
          ]
        }
      ],
      '/convertible-bond/': [
        {
          title: '可转债',
          collapsable: false,
          children: [
            '可转债.md',
          ]
        }
      ],
    },
    sidebarDepth: 2, // 侧边栏显示2级
  }
};