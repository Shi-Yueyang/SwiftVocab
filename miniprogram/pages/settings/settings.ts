

Page({
  data: {
    buttons: [{text: '取消'}, {text: '确认'}],
    totalWords:0,
    vocabularyCategories: [
      { name: 'Taylor Swift', progress: 1 },
      { name: 'Lana Del Ray', progress: 1 },
      { name: 'Billie Eilish', progress: 1 },
      { name: 'Eminem', progress: 1 }
    ],
    learningProgress: [] as LearningProgress[]
  },
  onLoad() {
    console.log('Settings page loaded');
    const app = getApp<IAppOption>();
    this.setData({
      totalWords:app.globalData.userExperience?.totalWords
    })


  },

  async LoadProgress() {
    const db = wx.cloud.database();
    const $ = db.command.aggregate
    const progressData = await db.collection('userProgress').get()

  }
})