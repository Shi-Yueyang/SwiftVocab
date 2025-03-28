interface UserInfo {
  avatarUrl: string;
  nickName: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
  openid?: string;
}

interface IAppOption {
  globalData: {
    userInfo: UserInfo | null;
    hasUserInfo: boolean;
  }
}

App<IAppOption>({
  globalData: {
    userInfo: null,
    hasUserInfo: false
  },
  onLaunch() {
    wx.cloud.init({
      env: 'syy1-8g91c2cm82ae8254',
      traceUser: true,
    })
  },
})