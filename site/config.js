import { defineConfig } from 'hhxpress'

export default defineConfig({
  title: 'HHX的网站',
  themeConfig: {
    nav: {
      title: 'HHX',
      items: [
        { text: '笔记', link: '/笔记/0介绍/intro' },
        { text: '面试', link: '/面试/0介绍/intro' },
        { text: '工具', link: '/工具/0介绍/intro' },
        { text: '收集', link: '/收集/0介绍/intro' },
        { text: '业务', link: '/业务/0介绍/intro' },
      ],
    },
  },
})
