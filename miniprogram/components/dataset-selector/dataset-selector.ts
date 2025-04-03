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
      this.setData({
        datasetIndex: e.detail.value
      })
      this.triggerEvent('datasetchange', {sourceId: e.detail.value})
    }
  }
})