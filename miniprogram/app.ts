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
  }
}

App<IAppOption>({
  globalData: {
    userInfo: null,
  },
  onLaunch() {
    wx.cloud.init({
      env: 'syy1-8g91c2cm82ae8254',
      traceUser: true,
    })
  },
})