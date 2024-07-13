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
const func = require('../../../utils/func');
import wxParse from '../../../wxParse/wxParse.js'; // 富文本插件

Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeid: 0, // 栏目ID
    detail: {}, // 文档详情 
    channelList: [], // 顶部分类列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    if (options.scene) { //这里为线上操作
      // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      let scene = decodeURIComponent(options.scene);
      let typeid = func.getQueryVariable('typeid', scene);
      _this.data.typeid = !typeid ? _this.data.typeid : typeid;
    } else { //这里为开发环境
      if (options.typeid !== 'undefined') {
        _this.data.typeid = !options.typeid ? 0 : options.typeid;
      }
    }
    _this.setData({
      typeid: _this.data.typeid
    });
    _this.getPageData(); // 获取页面数据
  },
  /**
   * 生命周期回调—监听页面显示
   */
  onShow() {},
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    let _this = this;
    _this.getPageData(); // 获取页面数据
    wx.stopPullDownRefresh() // 停止下拉刷新
  },
  /**
   * 获取页面数据
   */
  getPageData() {
    this.getArchivesView(); // 获取文档详情
  },
  /**
   * 获取文档详情
   */
  getArchivesView() {
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      channelid: _this.data.channelid, // 模型ID
      typeid: _this.data.typeid, // 栏目ID
      apiChannel: `ekey=1&type=son&currentstyle=active&showalltext=on`, // 栏目列表标签channel
      apiType:`ekey=1&addfields=content`
      // 这里可以根据需求填写更多的api标签
    }, function (res) {
      // 特别说明：中括号[1]的数字必须与api标签的参数ekey=1值对应，否则数据对不上。
      let type_1 = res.data.apiType[1], // type指定栏目数据
        channel_1 = res.data.apiChannel[1], // channel栏目列表数据
        content = type_1.data.content; //内容
        // 富文本转码
      if (content && content.length > 0) {
        wxParse.wxParse('content', 'html', content, _this, 0);
      }
      let arctypeInfo = type_1.data;
        let channelList = _this.data.channelList;
        if(channelList.length < 1 || channel_1.data.length > 1){
          channelList = channel_1.data;
        }
      // let channelList = channel_1.data;
      // 设置导航标题
      wx.setNavigationBarTitle({
        title: arctypeInfo.typename || '全部列表'
      })
      _this.setData({
        arctypeInfo: arctypeInfo,
        channelList: channelList,
        isLoading: false
      });
      // 点击进入三级栏目列表，处理二级导航焦点
      if (arctypeInfo.grade == 2) {
        let currentNav = arctypeInfo.parent_id;
        let beforeCurrentNav = currentNav;
        _this.setData({
          currentNav: currentNav, // 展开栏目导航的焦点选中
          beforeCurrentNav: beforeCurrentNav, // 点击展开栏目导航之前tag的index值
        });
      }
    });
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    // 构建页面参数
    let params = App.getShareUrlParams({
      'typeid': _this.data.detail.typeid
    });
    return {
      title: _this.data.detail.typename,
      path: "/pages/archives/single/view?" + params
    };
  },
  /**
   * 切换导航栏
   */
  onSwitchTab: function (e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let current_channel =  e.currentTarget.dataset.current_channel;
    if(current_channel == 6 && id != this.data.typeid){  //单页栏目
      wx.navigateTo({
        url: `/pages/archives/single/view?typeid=${id}`,
      })
    }else if(current_channel != 6){
      func.jumpList(e)
    }
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    let _this = this;
    return {
      title: _this.data.detail.typename,
    }
  },
  /**
   * 跳转列表页
   */
  jumpList(e) {
    func.jumpList(e)
  },
  /**
   * 跳转详情页
   */
  jumpView(e) {
    func.jumpView(e)
  },
})
