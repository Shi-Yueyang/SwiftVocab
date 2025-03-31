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
  async onLoad() {
    await this.loadUserExperience();
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

  async loadUserExperience() {
    try {
      const db = wx.cloud.database();
      const { data } = await db.collection("userExperience").get();

      if (data && data.length > 0) {
        const userExp = data[0] as UserExperience;
        app.globalData.userExperience = {
          totalWords: userExp.totalWords,
          learningTime: userExp.learningTime
        };
      } else {
        // Create initial user experience document
        const initialExperience = {
          totalWords: 0,
          learningTime: 0
        };

        await db.collection("userExperience").add({
          data: initialExperience
        });

        app.globalData.userExperience = initialExperience;
      }
      console.log("User experience loaded:", app.globalData.userExperience);
    } catch (err) {
      console.error("Failed to load user experience:", err);
    }
  },

  goToVocabulary() {
    console.log("Navigating to vocabulary page");
    wx.switchTab({
      url: "/pages/vocabulary/vocabulary",
    });    
  },
});
