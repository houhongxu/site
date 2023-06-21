import { defineConfig } from 'hhxpress'

export default defineConfig({
  title: 'HHX的网站',
  themeConfig: {
    nav: {
      title: 'HHX',
      items: [
        { text: '主页', link: '/' },
        { text: '笔记', link: '/note/0介绍/intro' },
        { text: '面试', link: '/interview/0介绍/intro' },
        { text: '工具', link: '/package/0介绍/intro' },
      ],
    },
  },
})
