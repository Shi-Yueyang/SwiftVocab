Page({
  data: {
    buttons: [{ text: "取消" }, { text: "确认" }],
    totalWords: 0,
    learningProgress: [] as LearningProgress[],
    allSources: [] as Source[],
  },

  onLoad() {
    console.log("Settings page loaded");
  },
  onShow() {
    console.log("Settings page shown");
    this.LoadProgress();
  },

  async LoadProgress() {
    // set learning progress
    const app = getApp<IAppOption>();
    const db = wx.cloud.database();
    const progressData = await db.collection("userProgress").get();
    const learningProgress = progressData.data as LearningProgress[];
    const learningPrograsWithTotal = learningProgress.map((item) => {
      const source = app.globalData.allSources.find(
        (source) => source.name === item.source
      );
      if (!source) {
        return item; // Return the original item if source is not found
      }
      return {
        ...item,
        totalNumber: source.count,
        progressPercent: (item.finalIndex / source.count) * 100, // Avoid division by zero
      };
    });
    this.setData({
      learningProgress: learningPrograsWithTotal,
    });

    // set user experience
    const userExperienceData = await db.collection("userExperience").get();
    this.setData({
      totalWords: userExperienceData.data[0].totalWords,
    });
  },
});
