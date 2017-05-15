//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list: []
  },
  //事件处理函数
  startScan: function () {
    var that = this;
    console.log("开始扫描");
    wx.openBluetoothAdapter({//初始化蓝牙
      fail: function (res) {
        console.log(res)
      },
      success: function (res) {
        console.log(res)
        wx.getBluetoothAdapterState({//
          success: function (res) {
            console.log(res.available)
            if (res.available) {
              console.log("开始扫描");
              wx.startBluetoothDevicesDiscovery({
                services: ['FFF0'],//'FFF0'
                success: function (res) {
                  console.log(res)
                }
              })
            } else {
              wx.showToast({
                title: '请打开蓝牙',
                icon: 'loading',
                duration: 3000
              })
            }
          }
        })
      }
    });
    wx.onBluetoothDeviceFound(function (res) {
      console.log(res);
      var list = that.data.list;

      list.push(res);
      that.setData({
        list:list
      });
    });
  },
  connectDevice: function(e) {
    var that = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log(res);
      }
    });

    var index = e.target.dataset.index;
    var deviceId = that.data.list[index].deviceId;

    wx.createBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        console.log(res);
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success: function (res) {
            console.log(res);
            for(var i=0, len=res.services.length; i<len; i++) {
              var service = res.services[i];
              console.log(service);
              if (service.uuid == '0000fff0-0000-1000-8000-00805f9b34fb') {
                wx.getBLEDeviceCharacteristics({
                  deviceId: deviceId,
                  serviceId: service.uuid,
                  success: function (res) {
                    console.log(res);

                    for (var j = 0, lenJ = res.characteristics.length; j<lenJ; j++) {
                      var characteristic = res.characteristics[j];
                      console.log(characteristic);

                      if (characteristic.uuid  == '0000fff6-0000-1000-8000-00805f9b34fb') {
                        wx.notifyBLECharacteristicValueChange({
                          state: true, // 启用 notify 功能
                          deviceId: deviceId,
                          serviceId: service.uuid,
                          characteristicId: characteristic.uuid,
                          success: function (res) {
                            console.log(res);
                          }
                        })

                      }
                    }
                  }
                })
              }
            }
          }
        });
      }
    });
    wx.onBLECharacteristicValueChange(function (res) {
      console.log(res);
    })
  }


})
