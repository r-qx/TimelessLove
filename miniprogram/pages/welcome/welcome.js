Page({
  data: {},

  onLoad() {
    const token = wx.getStorageSync('token');
    
    if (token) {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  goToLogin() {
    wx.setStorageSync('hasSeenWelcome', true);
    wx.redirectTo({ url: '/pages/auth/login/login' });
  },

  skipLogin() {
    wx.setStorageSync('hasSeenWelcome', true);
    wx.setStorageSync('skipLogin', true);
    wx.switchTab({ url: '/pages/index/index' });
  },
});
