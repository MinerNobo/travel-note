export default defineAppConfig({
  pages: ["pages/index/index", "pages/myNote/index", "pages/publish/index", "pages/mine/index", "pages/login/index", 'pages/register/index', 'pages/detail/index'],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: false, // 用微信默认的tabbar
    color: "7A7E83",
    selectedColor: "#1890ff", // 文字选中颜色
    backgroundColor: "#ffffff", // 背景色
    borderStyle: "black", // 边框颜色
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/tabbar/home.png",
        selectedIconPath: "assets/tabbar/home-active.png"
      },
      {
        pagePath: "pages/myNote/index",
        text: "游记",
        iconPath: "assets/tabbar/mynote.png",
        selectedIconPath: "assets/tabbar/mynote-active.png"
      },
      {
        pagePath: "pages/publish/index",
        text: "发布",
        iconPath: "assets/tabbar/publish.png",
        selectedIconPath: "assets/tabbar/publish-active.png"
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "assets/tabbar/mine.png",
        selectedIconPath: "assets/tabbar/mine-active.png"
      },
    ],
  },
});
