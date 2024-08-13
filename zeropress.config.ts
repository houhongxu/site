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
  },
};

export default config;
