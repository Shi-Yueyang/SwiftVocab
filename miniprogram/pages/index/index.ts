interface UserInfo {
  avatarUrl: string;
  nickName: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}

Page({
  data: {
    message: '...Ready for it?',
    userInfo: null as UserInfo | null,
    hasUserInfo: false
  },
  onLoad() {
    console.log('Index page loaded');
    this.checkStoredLogin();
  },
  checkStoredLogin() {
    try {
      const storedUserInfo = wx.getStorageSync('userInfo');
      if (storedUserInfo) {
        this.setData({
          userInfo: storedUserInfo,
          hasUserInfo: true
        });
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
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        });
        // Store user info for future auto-login
        try {
          wx.setStorageSync('userInfo', userInfo);
        } catch (err) {
          console.error('Failed to store user info:', err);
        }
        // Here you would typically send the code to your backend
        // to exchange for openid and session_key
        console.log('Login successful:', userInfo);
        // Navigate to vocabulary page after successful login
        this.navigateToVocabulary();
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
    if (this.data.hasUserInfo) {
      this.navigateToVocabulary();
    } else {
      this.handleLogin();
    }
  }
})