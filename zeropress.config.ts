import { UserConfig } from "zeropress";

const config: UserConfig = {
  title: "HHX的网站",
  description: "推荐试用ZEROPRESS部署同款网站",
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
