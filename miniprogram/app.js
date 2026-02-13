import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from './store/index';
import { API_BASE_URL,STORAGE_KEYS } from './utils/config';
App({
  globalData: {
    userInfo: null,
    coupleInfo: null,
    apiBaseUrl: API_BASE_URL,
    token: null,
  },

  onLaunch() {
    this.checkUpdate();
    
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.getUserInfo();
    }
  },

  async getUserInfo() {
    try {
      const res = await this.request({
        url: '/users/profile',
        method: 'GET',
      });
      this.globalData.userInfo = res.data;
      wx.setStorageSync(STORAGE_KEYS.USER_INFO, res.data);
      
      if (res.data.coupleId) {
        this.getCoupleInfo();
      }
    } catch (error) {
      console.error('获取用户信息失败', error);
      // 只在明确的认证错误时才清除token
      if (error.code === 40100 || error.code === 40101) {
        wx.removeStorageSync('token');
      }
    }
  },

  async getCoupleInfo() {
    try {
      const res = await this.request({
        url: '/couples/my',
        method: 'GET',
      });
      this.globalData.coupleInfo = res.data;
    } catch (error) {
      console.error('获取情侣信息失败', error);
    }
  },

  navigateToLogin() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage && currentPage.route !== 'pages/auth/login/login') {
      wx.navigateTo({
        url: '/pages/auth/login/login',
      });
    }
  },

  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.apiBaseUrl + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.globalData.token}`,
          ...options.header,
        },
        success: (res) => {
          if (res.data.code === 20000) {
            resolve(res.data);
          } else if (res.data.code === 40100 || res.data.code === 40101) {
            this.navigateToLogin();
            reject(res.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none',
            });
            reject(res.data);
          }
        },
        fail: (error) => {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none',
          });
          reject(error);
        },
      });
    });
  },

  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              },
            });
          });
        }
      });
    }
  },
});
