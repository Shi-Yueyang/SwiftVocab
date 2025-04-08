

Page({
  data: {
    buttons: [{text: '取消'}, {text: '确认'}],
    totalWords:0,
    learningProgress: [] as LearningProgress[],
    allSources: [] as Source[]

  },

  onLoad() {
    console.log('Settings page loaded');
    this.LoadProgress();
    
  },
  
  async LoadProgress() {
    const app = getApp<IAppOption>();
    this.setData({
      totalWords: app.globalData.userExperience?.totalWords || 0 // for display
    });

    const db = wx.cloud.database();
    const progressData = await db.collection('userProgress').get()

    const learningProgress = progressData.data as LearningProgress[];
    const learningPrograsWithTotal = learningProgress.map((item) => {
      const source = app.globalData.allSources.find((source) => source.name === item.source);
      return {
        ...item,
        totalNumber: source ? source.count : 0,
        progressPercent: (item.finalIndex / (source ? source.count : 1))*100 , // Avoid division by zero
      };
    });
    this.setData({
      learningProgress: learningPrograsWithTotal,
    });
    const userExperienceData = await db.collection('userExperience').get()
    this.setData({
      totalWords: userExperienceData.data[0].totalWords,  
    });

  }
})