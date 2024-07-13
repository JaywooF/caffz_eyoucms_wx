/**
 * 易优CMS
 * ============================================================================
 * 版权所有 2016-2028 海南赞赞网络科技有限公司，并保留所有权利。
 * 网站地址: http://www.eyoucms.com
 * ----------------------------------------------------------------------------
 * 如果商业用途务必到官方购买正版授权, 以免引起不必要的法律纠纷.
 * ============================================================================
 * Author: 小虎哥 <1105415366@qq.com>
 * Date: 2020-1-1
 */

let apikey = 's6gTfcHSv8Cjs3KksFEhHKS7xGiiETeq'; // 开源小程序API接口密钥
let domain = 'http://127.0.0.1:8090'; // 网站域名，目前仅支持https
let root_dir = ''; // 子目录，比如：/sub

// 底部导航菜单
let tabbar = {
    selected: -1, // 默认选中位置
    color: "#666666", // 文字默认颜色
    selectedColor: "#ff9900", // 文字选中时的颜色
    backgroundColor: "#FFFFFF", // 背景色
    borderStyle: "#000000", // 边框的颜色
    list: [{
        text: "首页",
        pagePath: "/pages/index/index",
        iconPath: "/static/images/tabBar/home.png",
        selectedIconPath: "/static/images/tabBar/home-active.png"
      },
      // {
      //   "text": "分类",
      //   "pagePath": "pages/category/index",
      //   "iconPath": "/static/images/tabBar/fenlei.png",
      //   "selectedIconPath": "/static/images/tabBar/fenlei_active.png"
      // },
      {
        text: "新闻",
        pagePath: "/pages/archives/article/list?typeid=2",
        iconPath: "/static/images/tabBar/news.png",
        selectedIconPath: "/static/images/tabBar/news-active.png"
      },
      // {
      //   text: "产品",
      //   pagePath: "/pages/archives/product/list?typeid=3",
      //   iconPath: "/static/images/tabBar/product.png",
      //   selectedIconPath: "/static/images/tabBar/product-active.png"
      // },
      {
        pagePath: "/pages/user/index",
        text: "我的",
        iconPath: "/static/images/tabBar/user.png",
        selectedIconPath: "/static/images/tabBar/user-active.png"
    }
  ]
};

let setting = {
  domain, // 网站域名
  root_dir, // 子目录
  apikey, // 子目录
  tabbar, // 底部导航菜单
};

module.exports = setting