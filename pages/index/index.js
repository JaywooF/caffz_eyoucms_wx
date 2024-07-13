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

const App = getApp();
const func = require('../../utils/func.js');
import wxParse from '../../wxParse/wxParse.js'; // 富文本插件

Page({

  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let _this = this;
    _this.getPageData(); // 加载页面数据
  },
  /**
   * 生命周期回调—监听页面显示
   */
  onShow() {

  },
  /**
   * 加载页面数据
   */
  getPageData: function () {
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiIndexUrl, {
      apiAdv_1: `ekey=1&pid=3`, // 广告位标签adv
      apiArclist_1: `ekey=1&channel=2&limit=4&flag=c`, // 第一个文档列表标签arclist
      apiArclist_2: `ekey=2&typeid=12&limit=3`, // 第二个文档列表标签arclist
      apiArclist_3: `ekey=3&typeid=4&limit=4`, // 第三个文档列表标签arclist
      apiType_1: `ekey=1&typeid=8&addfields=content&infolen=140&suffix=false`, // 指定栏目标签type
      apiGlobal: `ekey=1`, // 全局配置变量标签global
      // 这里可以根据需求填写更多的api标签
    }, function (res) {
      // 特别说明：中括号[1]的数字必须与api标签的参数ekey=1值对应，否则数据对不上。
      let adv_1 = res.data.apiAdv[1], // adv广告位数据
        arclist_1 = res.data.apiArclist[1], // 第一个arclist文档列表数据
        arclist_2 = res.data.apiArclist[2], // 第二个arclist文档列表数据
        arclist_3 = res.data.apiArclist[3], // 第三个arclist文档列表数据
        type_1 = res.data.apiType[1], // type指定栏目数据
        shop_open = res.data.usersConf.shop_open,
        global = res.data.apiGlobal[1]; // global全局配置变量数据
      // html富文本转码
      if (undefined != type_1.data.content) {
        wxParse.wxParse('type_1_content', 'html', type_1.data.content, _this, 0);
      }
      // 设置导航标题
      wx.setNavigationBarTitle({
        // title: global.data.web_name || '易优CMS小程序'
        title: '微信原生综合小程序' || '易优CMS小程序'
      })
      _this.setData({
        adv_1,
        arclist_1,
        arclist_2,
        arclist_3,
        type_1,
        shop_open,
        global,
      });
    });
  },
  navLink(e) {
    let _this = this 
    let typeid = e.currentTarget.dataset.item.typeid;
    let f_cur = e.currentTarget.dataset.item.f_cur;
    let tips = e.currentTarget.dataset.item.tips;
    let type = e.currentTarget.dataset.item.type;
    if (typeid == 1 ) {
        if (!_this.data.Discountactive || type == 'jifen') {
          wx.showToast({
            icon: 'none',
            title: e.currentTarget.dataset.item.tips,
            duration: 1000
          });
        } else{
          let active_id = _this.data.Discountactive.active_id
          wx.navigateTo({
            url:`/pages/discount/index?active_id=${active_id}`
          })
        }
    } else{
      wx.reLaunch({
        url:`/pages/category/index?typeid=${typeid}&f_cur=${f_cur}`
      })
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.getPageData(); // 获取首页数据
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.title,
      path: "/pages/index/index?" + App.getShareUrlParams()
    };
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    let _this = this;
    return {
      title: _this.data.page.params.title,
    }
  },
  /**
   * 跳转列表页
   */
  jumpList(e) {
    func.jumpList(e)
  },
  jumproductList(){
    wx.navigateTo({
      url: `/pages/archives/product/list?typeid=3`,
    })
  },
  /**
   * 跳转详情页
   */
  jumpView(e) {
    func.jumpView(e)
  },
  jumpToSearch() {
    wx.navigateTo({
        url: `/pages/search/index`
    });
  },
   /*
   * 跳转到指定页面
   */
  navigationTo:function(e){
    let url = e.currentTarget.dataset.url;
    if (url) {
      func.navigateTo(url)
    }
  },
  /**
   * 点击拨打电话
   */
  makePhoneCall: function (e) {
    let mobile = e.currentTarget.dataset.mobile
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  /**
   * 地图导航
   */
  gomap: function (e) {
    let coordinate = e.currentTarget.dataset.coordinate || '19.992555,110.339932';
    if (coordinate) {
      let address = e.currentTarget.dataset.address || '';
      let map = coordinate.split(',');
      wx.openLocation({
        latitude: parseFloat(map[0]),
        longitude: parseFloat(map[1]),
        address: address
      })
    }
  },
});