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
      console.log('bindDatasetChange', e.detail.value)
      this.setData({
        datasetIndex: e.detail.value
      })
      this.triggerEvent('sourceId', {datasetIndex: e.detail.value})
    }
  }
})