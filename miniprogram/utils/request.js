import { API_BASE_URL, STORAGE_KEYS } from './config';

class Request {
  baseURL = API_BASE_URL;

  request(options) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync(STORAGE_KEYS.TOKEN);
      
      console.log('📤 发送请求:', {
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data,
      });
      
      wx.request({
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'ngrok-skip-browser-warning': 'true',
          'User-Agent': 'TimelessLove-Miniprogram',
          ...options.header,
        },
        success: (res) => {
          if (res.data.code === 20000) {
            resolve(res.data);
          } else if (res.data.code === 40100 || res.data.code === 40101) {
            console.log('认证失败，清除token');
            wx.removeStorageSync(STORAGE_KEYS.TOKEN);
            reject(res.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none',
              duration: 2000,
            });
            reject(res.data);
          }
        },
        fail: (error) => {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none',
            duration: 2000,
          });
          reject(error);
        },
      });
    });
  }

  get(url, data) {
    return this.request({ url, method: 'GET', data });
  }

  post(url, data) {
    return this.request({ url, method: 'POST', data });
  }

  put(url, data) {
    return this.request({ url, method: 'PUT', data });
  }

  patch(url, data) {
    return this.request({ url, method: 'PATCH', data });
  }

  delete(url, data) {
    return this.request({ url, method: 'DELETE', data });
  }
}

export default new Request();
