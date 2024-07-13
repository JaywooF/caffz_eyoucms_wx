


const App = getApp();

const func = require('../../../utils/func');

Page({
    // 页面初始化 options为页面跳转所带来的参数
    data: {
      typeid: 6,
      // 留言栏目ID
      detail: {},
      attr_list_row:{},   //表单属性列表
      picker_id_arr:[],   //下拉框属性id集合
      image_arr:[],       //单图属性id集合
      images_arr:[],      //多图属性id集合
      file_arr:[],      //附件属性id集合
      date_arr:[],      //日期属性id集合
      region_arr:[],    //区域选择属性id集合
      token: {},
      // 表单令牌，避免重复提交表单
      loading: false,
      isApiLoaded: false,
      
    },
    onLoad: function (options) {
        let that = this;

        if (options.scene) {
            //这里为线上操作
            // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
            let scene = decodeURIComponent(options.scene);
            let sceneArr = scene.split('='); // typeid=123  为字符串，需要我们去分割

            if (!sceneArr[1]) {
                that.typeid = 0;
            } else {
                that.typeid = sceneArr[1];
            }
        } else if (options.typeid !== 'undefined') {
            //这里为开发环境
            if (!options.typeid) {
                that.typeid = 0;
            } else {
                that.typeid = options.typeid;
            }
        }

        that.setData({
            typeid: that.typeid
        });
        that.getPageData(); // 获取留言表单数据
    },
    /**
     * 生命周期回调—监听页面显示
     */
    onShow() {},
    /**
     * 监听用户下拉动作
     */
    // onPullDownRefresh: function () {
    //     let that = this;
    //     wx.stopPullDownRefresh(); // 停止下拉刷新
    // },
    /**
     * 分享当前页面
     */
    onShareAppMessage() {
        let _this = this;

        let typeid = _this.typeid;
        return {
            title: _this.detail.typename,
            path: `/pages/archives/guestbook/index?typeid=${typeid}` + app.globalData.getShareUrlParams()
        };
    },
    /**
     * 分享到朋友圈
     */
    onShareTimeline() {
        let _this = this;

        return {
            title: _this.detail.typename
        };
    },
    /**
     * 获取页面数据
     */
    getPageData() {
        this.getGuestbookData(); // 获取留言表单数据
    },

    /**
     * 获取留言表单字段列表数据
     */
    getGuestbookData: function () {
        let that = this;
        App._requestApi(
            that,
            App.globalData.config.apiGuestbookFormUrl,
            {
                typeid: that.data.typeid,
                apiGuestbookform: `ekey=0`
            },
            function (res) {
                let detail = res.data.apiGuestbookform[0].detail;
                let attr_list_row = res.data.apiGuestbookform[0].attr_list_row;
                let token = res.data.apiGuestbookform[0].token; // 设置导航标题
                wx.setNavigationBarTitle({
                    title: detail.typename || '在线表单'
                });
                //创建并初始化下拉框类型字段
                let picker_id_arr = [];
                for (let index in attr_list_row){
                    if(attr_list_row[index]['attr_input_type'] == 1){
                        picker_id_arr.push("attr_"+attr_list_row[index]['attr_id']);
                    }
                }
                let image_arr = [];
                for (let index in attr_list_row){
                  if(attr_list_row[index]['attr_input_type'] == 5){
                    image_arr.push("attr_"+attr_list_row[index]['attr_id']);
                  }
                }
                let images_arr = [];
                for (let index in attr_list_row){
                  if(attr_list_row[index]['attr_input_type'] == 11){
                    images_arr.push("attr_"+attr_list_row[index]['attr_id']);
                  }
                }
                let file_arr = [];
                for (let index in attr_list_row){
                  if(attr_list_row[index]['attr_input_type'] == 8){
                    file_arr.push("attr_"+attr_list_row[index]['attr_id']);
                  }
                }
                let date_arr = [];
                for (let index in attr_list_row){
                  if(attr_list_row[index]['attr_input_type'] == 10){
                    date_arr.push("attr_"+attr_list_row[index]['attr_id']);
                  }
                }
                let region_arr = [];
                for (let index in attr_list_row){
                  if(attr_list_row[index]['attr_input_type'] == 9){
                    region_arr.push("attr_"+attr_list_row[index]['attr_id']);
                  }
                }
                
                
                that.setData({
                    detail,
                    attr_list_row,
                    picker_id_arr,
                    image_arr,
                    images_arr,
                    file_arr,
                    date_arr,
                    region_arr,
                    token
                });
            }
        );
    },
    
    /**
     * 提交表单
     */
    formSubmit: function (e) {
        let that = this;
        let data = e.detail.value;
        let picker_id_arr = this.data.picker_id_arr;
        //重新给下拉框赋值
        if(picker_id_arr.length > 0){     
            for (let index in data){
                if(picker_id_arr.indexOf(index) > -1){
                    let index_arr = index.split("_");
                    data[index] = undefined === that.data.attr_list_row[index_arr[1]].options[data[index]] ? "" : that.data.attr_list_row[index_arr[1]].options[data[index]];
                }
            }
        }
        //循环上传单图，并且重新给对应的data值赋值
        let file_arr = this.data.file_arr;
        if(file_arr.length > 0){
          for (let index in file_arr){
            let index_arr = file_arr[index].split("_");
            if(that.data.attr_list_row[index_arr[1]].selected.length > 0){
              data[file_arr[index]] = that.data.attr_list_row[index_arr[1]].selected;
            }
          }
        }
        //循环上传单图，并且重新给对应的data值赋值
        let image_arr = this.data.image_arr;
        if(image_arr.length > 0){
          for (let index in image_arr){
            let index_arr = image_arr[index].split("_");
            if(that.data.attr_list_row[index_arr[1]].selected.length > 0){
              data[image_arr[index]] = that.data.attr_list_row[index_arr[1]].selected;
            }
          }
        }
        //循环上传多图，并且重新给对应的data值赋值
        let images_arr = this.data.images_arr;
        if(images_arr.length > 0){
          for (let index in images_arr){
            let index_arr = images_arr[index].split("_");
            if(that.data.attr_list_row[index_arr[1]].selected.length > 0){
              data[images_arr[index]] = that.data.attr_list_row[index_arr[1]].selected;
            }
          }
        }
        //循环日期字段，并且重新给对应的data值赋值  
        let date_arr = this.data.date_arr;
        if(date_arr.length > 0){
          for (let index in date_arr){
            if(data[date_arr[index]].length > 0){
              let date_time = data[date_arr[index]].replace(/-/g,'/');
              data[date_arr[index]] = Date.parse(date_time)/1000;
            }
          }
        }
        //循环所有区域选择分类，并且重新给对应的data值赋值  
        let region_arr= this.data.region_arr;
        if(region_arr.length > 0){
          for (let index in region_arr){
            let index_arr = region_arr[index].split("_");
            console.log(index_arr,that.data.attr_list_row[index_arr[1]]);
            if(that.data.attr_list_row[index_arr[1]].selected.length > 0){
              data[region_arr[index]] = that.data.attr_list_row[index_arr[1]].selected;
            }
          }
        }
        data.typeid = this.data.typeid;   //传所调取后台留言模型对应的id   
        data[that.data.token.name] = that.data.token.value; // 提交到后端
        console.log(data);
        // return false;
        App._requestPost(that, App.globalData.config.apiGuestbookUrl, data, function (res) {
          if (res.msg == '请先登录') {
            App.doLogin();
          } 
          App.showSuccess(res.msg, function () {
            that.sendemail(res.data.aid, that.data.typeid); // 发送邮箱
            wx.redirectTo({
                url: `/pages/archives/guestbook/index?typeid=${data.typeid}`
            });
          });
        });
    },

    /**
     * 重置表单
     */
    formReset: function () {
        let that = this;
        that.getPageData();
    },

    /**
     * 发送邮箱
     */
    sendemail: function (aid, typeid) {
        let apikey_token = App.getApikeyToken();
        wx.request({
            url: App.globalData.config.apiSendemailUrl,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            data: {
                apikey_token:apikey_token,
                type: 'gbook_submit',
                typeid: typeid,
                aid: aid
            },
            success(res) {}
        });
    },

    /**
     * 底部导航菜单切换
     */
    switchTab: function (e) {
        func.switchTab(e);
    },

    /**
     * 跳转列表页
     */
    jumpList(e) {
        func.jumpList(e);
    },

    /**
     * 跳转详情页
     */
    jumpView(e) {
        func.jumpView(e);
    },
    /*
    * 下拉框选择,给选中框重新赋值
     */
    examinationType(e) {
      let value_key = e.detail.value;
      let list_id = e.currentTarget.dataset.id;
      let attr_list_row = this.data.attr_list_row;
      attr_list_row[list_id].selected = attr_list_row[list_id].options[value_key];
      this.setData({
        attr_list_row:attr_list_row
      });
    },
    /*
    * 日期选择器回调
    */
   examinationDate(e){
    let value = e.detail.value;
    let list_id = e.currentTarget.dataset.id;
    let attr_list_row = this.data.attr_list_row;
    attr_list_row[list_id].selected = value;
    this.setData({
        attr_list_row:attr_list_row
    });
   },
   /*
    * 显示、隐藏筛选框
    */
   bindRegionShow:function(e){
    let _this = this;
    let attr_list_row = this.data.attr_list_row;
    let list_id = e.currentTarget.dataset.id;
    if(attr_list_row[list_id].show){
      attr_list_row[list_id].show = 0;
    }else{
      attr_list_row[list_id].show = 1;
    }
    _this.setData({
      attr_list_row:attr_list_row
    });
   },
   /*
    * 选择区域
    */
  bindRegionChange:function(e){
    let _this = this;
    let attr_list_row = this.data.attr_list_row;
    let val_arr = e.detail.value;
    let list_id = e.currentTarget.dataset.id;
    let selected_id_old = attr_list_row[list_id].selected_id;
   
    if(val_arr[0] != selected_id_old[0]){
      let options1 = attr_list_row[list_id]['options1'][val_arr[0]];
      App._requestApi(
        _this,
        App.globalData.config.apiGetRegionUrl,
        {
          pid: options1.id,
        },
        function (res){
          attr_list_row[list_id]['selected_id'] = [val_arr[0],0,0];
          attr_list_row[list_id]['selected'] = [attr_list_row[list_id]['options1'][val_arr[0]]['id'],0,0];
          attr_list_row[list_id]['selected_name'] = attr_list_row[list_id]['options1'][val_arr[0]]['name'];
          attr_list_row[list_id]['options2'] = res.data;
          attr_list_row[list_id]['options3'] = [];
          _this.setData({
            attr_list_row:attr_list_row
          });
        }
      );
    }else if(val_arr[1] != selected_id_old[1]){
      let  options2 = attr_list_row[list_id]['options2'][val_arr[1]];
      App._requestApi(
        _this,
        App.globalData.config.apiGetRegionUrl,
        {
          pid: options2.id,
        },
        function (res){
          attr_list_row[list_id]['selected_id'] = [val_arr[0],val_arr[1],0];
          attr_list_row[list_id]['selected'] = [attr_list_row[list_id]['options1'][val_arr[0]]['id'],options2['id'],0];
          attr_list_row[list_id]['selected_name'] = attr_list_row[list_id]['options1'][val_arr[0]]['name']+","+options2['name'];
          attr_list_row[list_id]['options3'] = res.data;
          _this.setData({
            attr_list_row:attr_list_row
          });
        }
      );
    }else if(val_arr[2] != selected_id_old[2]){
      let  options3 = attr_list_row[list_id]['options3'][val_arr[2]];
      attr_list_row[list_id]['selected_id'] = [val_arr[0],val_arr[1],val_arr[2]];
      attr_list_row[list_id]['selected'] = [attr_list_row[list_id]['options1'][val_arr[0]]['id'],attr_list_row[list_id]['options2'][val_arr[2]]['id'],options3['id']];
      attr_list_row[list_id]['selected_name'] = attr_list_row[list_id]['options1'][val_arr[0]]['name']+","+attr_list_row[list_id]['options2'][val_arr[1]]['name']+","+options3['name'];
      _this.setData({
        attr_list_row:attr_list_row
      });
    }else{
      return false;
    }
  },
    /*
   *  单文件附件上传
    */
   examinationFile(e){
    let list_id = e.currentTarget.dataset.id;
    let attr_list_row = this.data.attr_list_row;
    let _this = this;
    wx.chooseMessageFile({
        type:'all',  //	从所有文件选择
        count: 1, //最多可以选择的文件个数
        success: function (res) {
          console.log("success",res);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFiles = res.tempFiles;
          let apikey_token = App.getApikeyToken();
          for (let i = 0; i < tempFiles.length; i++) {
            wx.uploadFile({
              url: App.globalData.config.shopUploadsUrl,
              filePath: tempFiles[i].path,
              formData:{
                is_absolute:1,
                apikey_token:apikey_token,
                file_type:"jpg|gif|png|jpeg|bmp|ico|webp|zip|gz|rar|iso|txt|doc|docx|xls|ppt|wps",     //允许上传文件类型（默认只能上传图片）
              },
              name: "file",
              success: function (res) {
                console.log("uploadFile success",res);
                let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
                console.log("uploadFile result",result);
                if(result.code == 1 && result.data.errcode == 0){
                    attr_list_row[list_id].selected = result.data.img_url;
                    attr_list_row[list_id].selected_name = tempFiles[i].name;
                    _this.setData({
                        attr_list_row:attr_list_row
                    });
                }else{
                  wx.showToast({
                    title: result.data.errmsg,
                    icon: "none",
                    duration: 2000
                  })
                }
              },
              fail: function (res) {
                console.log("uploadFile fail",res);
                wx.showToast({
                  title: "上传失败",
                  icon: "none",
                  duration: 2000
                })
              },
            })
          }
        },
        fail:function(res){
          console.log("fail",res);
        },
        complete:function(res){
          console.log("complete",res);
        }
      });
   },
    /*
   *  删除附件
    */
   deleteFile(e){
    let _this = this;
    let list_id = e.currentTarget.dataset.id;
    let attr_list_row = this.data.attr_list_row;
    wx.showModal({
      title: "提示",
      content: "是否删除",
      success: function (res) {
        if (res.confirm) {
            attr_list_row[list_id].selected = "";
            _this.setData({
                attr_list_row:attr_list_row
            });
        }
      }
    })
   },
   /*
   *  单图图片上传
    */
   examinationImage(e){
    let list_id = e.currentTarget.dataset.id;
    let attr_list_row = this.data.attr_list_row;
    let _this = this;
    wx.chooseMedia({
        mediaType:['image'],  //只能拍摄图片或从相册选择图片
        count: 1, //最多可以选择的文件个数
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFiles = res.tempFiles;
          let apikey_token = App.getApikeyToken();
          for (let i = 0; i < tempFiles.length; i++) {
            wx.uploadFile({
              url: App.globalData.config.shopUploadsUrl,
              filePath: tempFiles[i].tempFilePath,
              formData:{
                is_absolute:1,
                apikey_token:apikey_token,
              },
              name: "file",
              success: function (res) {
                let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
                if(result.code == 1){
                    attr_list_row[list_id].selected = result.data.img_url;
                    _this.setData({
                        attr_list_row:attr_list_row
                    });
                }
              },
              fail: function (err) {
                wx.showToast({
                  title: "上传失败",
                  icon: "none",
                  duration: 2000
                })
              },
            })
          }
        }
      });
   },
   /*
   *  单图删除图片
    */
   deleteImage(e){
    let _this = this;
    let list_id = e.currentTarget.dataset.id;
    let attr_list_row = this.data.attr_list_row;
    wx.showModal({
      title: "提示",
      content: "是否删除",
      success: function (res) {
        if (res.confirm) {
            attr_list_row[list_id].selected = "";
            _this.setData({
                attr_list_row:attr_list_row
            });
        }
      }
    })
   },
   /*
    *  多图图片上传
    */
   examinationImages(e){
    let list_id = e.currentTarget.dataset.id;
    let attr_list_row = this.data.attr_list_row;
    let _this = this;
    wx.chooseMedia({
        mediaType:['image'],  //只能拍摄图片或从相册选择图片
        count: 9, //最多可以选择的文件个数
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFiles = res.tempFiles;
          let apikey_token = App.getApikeyToken();
          for (let i = 0; i < tempFiles.length; i++) {
            wx.uploadFile({
              url: App.globalData.config.shopUploadsUrl,
              filePath: tempFiles[i].tempFilePath,
              formData:{
                is_absolute:1,
                apikey_token:apikey_token,
              },
              name: "file",
              success: function (res) {
                let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
                if(result.code == 1){
                    attr_list_row[list_id].selected.push(result.data.img_url);
                    _this.setData({
                        attr_list_row:attr_list_row
                    });
                }
              },
              fail: function (err) {
                wx.showToast({
                  title: "部分上传失败",
                  icon: "none",
                  duration: 2000
                })
              },
            })
          }
        }
      });
   },
   /*
   *  多图删除单张图片
    */
   deleteImages(e){
    let _this = this;
    let list_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let attr_list_row = this.data.attr_list_row;
    wx.showModal({
      title: "提示",
      content: "是否删除",
      success: function (res) {
        if (res.confirm) {
            attr_list_row[list_id].selected.splice(index, 1)
            _this.setData({
                attr_list_row:attr_list_row
            });
        }
      }
    })
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
})