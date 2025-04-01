interface UserExperience {
  totalWords: number;
  learningTime: number; // in seconds
  _id?: string; // For cloud database
  _openid?: string; //to identify the user
}

interface IAppOption {
  globalData: {
    allSources: string[];
    userExperience: UserExperience | null;
  }
}

App<IAppOption>({
  globalData: {
    allSources: [],
    userExperience: null,
  },
  onLaunch() {
    wx.cloud.init({
      env: 'syy1-8g91c2cm82ae8254',
      traceUser: true,
    })
  },
})