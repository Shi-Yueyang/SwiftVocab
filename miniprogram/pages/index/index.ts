interface OpenIdResponse {
  event: any;
  openid: string;
  appid: string;
  unionid: string;
  test: string;
}

// Add getApp type
const app = getApp<IAppOption>();

Page({
  data: {
  },
  onLoad() {
    console.log("Index page loaded");
    this.fetchUniqueSources();
  },

  async fetchUniqueSources() {
    try {
      const db = wx.cloud.database();
      const $ = db.command.aggregate
      const result = await db.collection('vocab')
        .aggregate()
        .group({
          _id: '$source',
          count: $.sum(1)
        })
        .end();
      const sources = result.list as Array<{ _id: string; count: number }>
      console.log('Unique sources fetched:', sources);
      
      const sourceNames = sources.map(source => source._id);
      // Update both global and local data
      app.globalData.sources = sourceNames;
      this.setData({
        sources: sourceNames
      });

    } catch (error) {
      console.error('Error fetching unique sources:', error);
    }
  },

  goToVocabulary() {
    console.log("Navigating to vocabulary page");
    wx.navigateTo({
      url: "/pages/vocabulary/vocabulary",
    });    
  },
});
