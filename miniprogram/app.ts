interface IAppOption {
  globalData: {
    sources: string[];
  }
}

App<IAppOption>({
  globalData: {
    sources: [],
  },
  onLaunch() {
    wx.cloud.init({
      env: 'syy1-8g91c2cm82ae8254',
      traceUser: true,
    })
  },
})