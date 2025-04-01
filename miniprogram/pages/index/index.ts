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
    allSources: [] as string[],
    sourceId: 1,
  },
  async onLoad() {
    await this.loadUserExperience();
    await this.fetchUniqueSources();
    console.log("Index page loaded");
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
      
      const allSources = sources.map(source => source._id);
      // Update both global and local data
      app.globalData.allSources = allSources;
      this.setData({
        allSources: allSources
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

  onSourceChange(e: any) {
    this.setData({
      sourceId:e.detail.sourceId,
    });
  },

  goToVocabulary() {
    console.log("Navigating to vocabulary page");
    wx.navigateTo({
      url: `/pages/vocabulary/vocabulary?sourceId=${this.data.sourceId}`,
    });    
  },
});
