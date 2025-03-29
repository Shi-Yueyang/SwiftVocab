Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    datasetList: ['Eras book'],
    datasetIndex: 0
  },

  /**
   * Component methods
   */
  methods: {
    bindDatasetChange: function(e: WechatMiniprogram.TouchEvent<any>) {
      console.log('picker发送选择改变, 携带值为', e.detail.value)
      this.setData({
        datasetIndex: e.detail.value
      })
      this.triggerEvent('datasetchange', {datasetIndex: e.detail.value})
    }
  }
})