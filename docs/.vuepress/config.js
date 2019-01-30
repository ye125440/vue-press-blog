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
      // {text: '前端基础', link: '/front-end/' },
      { text: '翻译', link: '/transfer/' },     
      { text: 'Github', link: 'https://github.com/ye125440' }     
    ],
    // sidebar: 'auto', // 侧边栏配置
    sidebar: {
      '/transfer/': [
        {
          title: '翻译文章',
          collapsable: false,
          children: [
            'VueJs 最佳实践.md',
            '用信鸽解释 HTTPS.md',
            '剪贴板 API 速成课.md'
          ]
        }
      ],
    },
    sidebarDepth: 2, // 侧边栏显示2级
  }
};