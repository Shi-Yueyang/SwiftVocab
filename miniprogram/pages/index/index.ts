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

interface OpenIdResponse {
  event: any;
  openid: string;
  appid: string;
  unionid: string;
  test: string;
}

Page({
  data: {
    message: '...Ready for it?'
  },
  onLoad() {
    console.log('Index page loaded');
    this.checkStoredLogin();
  },
  checkStoredLogin() {
    try {
      const storedUserInfo = wx.getStorageSync('userInfo');
      if (storedUserInfo) {
        const app = getApp<IAppOption>();
        app.globalData.userInfo = storedUserInfo;
        app.globalData.hasUserInfo = true;
        console.log('Auto-login successful with stored user info');
      }
    } catch (err) {
      console.error('Failed to get stored user info:', err);
    }
  },
  handleLogin() {
    wx.getUserProfile({
      desc: 'Used for user profile display',
      success: (profileRes) => {
        const userInfo = profileRes.userInfo;
        const app = getApp<IAppOption>();
        app.globalData.userInfo = userInfo;
        app.globalData.hasUserInfo = true;
        
        // Get openid from cloud function
        wx.cloud.callFunction({
          name: 'getOpenId',
          success: (res) => {
            const result = res.result as OpenIdResponse;
            console.log('OpenID:', result.openid);
            console.log('Test:', result.test);
            // Store user info and openid for future auto-login
            try {
              wx.setStorageSync('userInfo', {
                ...userInfo,
                openid: result.openid
              });
            } catch (err) {
              console.error('Failed to store user info:', err);
            }
            // Navigate to vocabulary page after successful login
            this.navigateToVocabulary();
          },
          fail: (err) => {
            console.error('Failed to get openid:', err);
            wx.showToast({
              title: 'Failed to get user ID',
              icon: 'none',
              duration: 2000
            });
          }
        });
      },
      fail: (err) => {
        console.error('Failed to get user profile:', err);
        wx.showToast({
          title: 'Login required to continue',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  navigateToVocabulary() {
    console.log("Navigating to vocabulary page");
    wx.navigateTo({
      url: '/pages/vocabulary/vocabulary',
    });
  },
  goToVocabulary() {
    const app = getApp<IAppOption>();
    if (app.globalData.hasUserInfo) {
      this.navigateToVocabulary();
    } else {
      this.handleLogin();
    }
  }
})