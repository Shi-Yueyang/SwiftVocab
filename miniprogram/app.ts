interface UserExperience {
  totalWords: number;
  learningTime: number; // in seconds
  _id?: string; // For cloud database
  _openid?: string; //to identify the user
}

interface Source{
  name: string;
  count: number;
}
interface IAppOption {
  globalData: {
    allSources: Source[];
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