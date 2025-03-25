Page({
  data: {
    message: '...Ready for it?'
  },
  onLoad() {
    console.log('Index page loaded');

  },
  goToVocabulary() {
    console.log("...");
    wx.navigateTo({
      url: '/pages/vocabulary/vocabulary',
    });
  }
})