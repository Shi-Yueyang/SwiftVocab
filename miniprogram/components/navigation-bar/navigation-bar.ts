Component({
  methods: {
    goToIndex() {
          wx.redirectTo({
            url: '/pages/index/index',
          });
        },
        goToSettings() {
          wx.redirectTo({
            url: '/pages/settings/settings',
          });
        },
  }
})
