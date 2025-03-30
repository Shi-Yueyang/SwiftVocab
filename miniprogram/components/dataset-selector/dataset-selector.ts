Component({
  properties: {
    sources: {
      type: Array,
      value: [] as string[],
      observer: function(newVal: string[]) {
        this.setData({
          datasetList: newVal
        });
      }
    }
  },

  data: {
    datasetList: [] as string[],
    datasetIndex: 0
  },

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