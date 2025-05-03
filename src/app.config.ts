export default defineAppConfig({
  pages: ["pages/index/index", "pages/myNote/index", "pages/publish/index", "pages/mine/index", "pages/login/index", 'pages/register/index'],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: false, // 先用微信默认的tabbar
    color: "7A7E83",
    selectedColor: "#3cc51f", // 文字选中颜色
    backgroundColor: "#ffffff", // 背景色
    borderStyle: "black", // 边框颜色
    // TODO：还需要选择tabBar的icon
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/myNote/index",
        text: "游记",
      },
      {
        pagePath: "pages/publish/index",
        text: "发布",
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
      },
    ],
  },
});
