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
    allSourceNames: [] as String[],
    sourceId: 0,
    catUrl: "https://cataas.com/cat",
  },
  async onLoad() {
    await this.loadUserExperience();
    await this.fetchUniqueSources();
    console.log("Index page loaded");
  },
  onShow() {
    this.setData({
      catUrl: "https://cataas.com/cat?" + new Date().getTime(), // Force reload the cat image
    });
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
      
      const allSources = sources.map(source => ({ name: source._id, count: source.count }));
      // Update both global and local data
      app.globalData.allSources = allSources;
      this.setData({
        allSourceNames: allSources.map(source=>source.name),
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
          learningTime: userExp.learningTime,
          _id:userExp._id,
          _openid:userExp._openid
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

    } catch (err) {
      console.error("Failed to load user experience:", err);
    }
  },

  onSourceChange(e: any) {
    this.setData({
      sourceId:e.detail.sourceId,
    });
  },

  goToVocabulary() {
    console.log("Navigating to vocabulary page, source id", this.data.sourceId);
    wx.navigateTo({
      url: `/pages/vocabulary/vocabulary?sourceId=${this.data.sourceId}`,
    });    
  },
});
