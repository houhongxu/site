import { UserConfig } from "zeropress";

const config: UserConfig = {
  title: "HHX的博客",
  description: "点击github图标一键部署同款博客",
  themeConfig: {
    nav: [
      {
        img: "/logo.jpg",
        link: "/",
        position: "left",
      },
      {
        dark: true,
      },
      {
        logo: "github",
        link: "https://github.com/houhongxu/hhxpress",
      },
    ],
    lastUpdated: {},
    editLink: {
      pattern: "https://github.com/houhongxu/site/edit/master/docs/:path",
      text: "编辑",
    },
  },
};

export default config;
