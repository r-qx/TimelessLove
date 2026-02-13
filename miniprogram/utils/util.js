import dayjs from '../miniprogram_npm/dayjs/index';

export function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  return dayjs(date).format(format);
}

export function formatRelativeTime(date) {
  if (!date) return '';
  
  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target, 'second');
  
  if (diff < 60) {
    return '刚刚';
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`;
  } else if (diff < 604800) {
    return `${Math.floor(diff / 86400)}天前`;
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 604800)}周前`;
  } else if (diff < 31536000) {
    return `${Math.floor(diff / 2592000)}个月前`;
  } else {
    return `${Math.floor(diff / 31536000)}年前`;
  }
}

export function calculateDays(startDate, endDate = new Date()) {
  if (!startDate) return 0;
  return dayjs(endDate).diff(dayjs(startDate), 'day');
}

export function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title,
    icon,
    duration,
  });
}

export function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true,
  });
}

export function hideLoading() {
  wx.hideLoading();
}

export function showModal(options) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: options.title || '提示',
      content: options.content,
      showCancel: options.showCancel !== false,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: reject,
    });
  });
}

export function navigateTo(url) {
  wx.navigateTo({ url });
}

export function redirectTo(url) {
  wx.redirectTo({ url });
}

export function switchTab(url) {
  wx.switchTab({ url });
}

export function navigateBack(delta = 1) {
  wx.navigateBack({ delta });
}

export function chooseImage(count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: resolve,
      fail: reject,
    });
  });
}

export function uploadFile(filePath, url) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    
    wx.uploadFile({
      url,
      filePath,
      name: 'file',
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 20000) {
          resolve(data);
        } else {
          reject(data);
        }
      },
      fail: reject,
    });
  });
}

export function throttle(fn, delay = 1000) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

export function debounce(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
