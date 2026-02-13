import { STORAGE_KEYS } from '../../utils/config';
import { showModal } from '../../utils/util';

Page({
  data: {
    userInfo: null,
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync(STORAGE_KEYS.USER_INFO);
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  goToEdit() {
    wx.navigateTo({
      url: '/pages/profile/edit/edit',
    });
  },

  goToCouple() {
    wx.navigateTo({
      url: '/pages/couple/couple',
    });
  },

  async onLogout() {
    const confirm = await showModal({
      title: '提示',
      content: '确定要退出登录吗？',
    });

    if (confirm) {
      wx.clearStorageSync();
      
      wx.showToast({
        title: '已退出登录',
        icon: 'success',
      });

      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/auth/login/login',
        });
      }, 1500);
    }
  },
});
