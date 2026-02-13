import { showToast, showLoading, hideLoading, uploadFile } from '../../../utils/util';
import { STORAGE_KEYS, API_BASE_URL } from '../../../utils/config';
import request from '../../../utils/request';

Page({
  data: {
    userInfo: {
      nickname: '',
      avatar: '',
      gender: 0,
      birthday: '',
    },
    genderPickerShow: false,
    genderColumns: [
      { text: '未知', value: 0 },
      { text: '男', value: 1 },
      { text: '女', value: 2 },
    ],
    genderText: '未知',
    saving: false,
  },

  onLoad() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync(STORAGE_KEYS.USER_INFO);
    if (userInfo) {
      this.setData({
        userInfo: {
          nickname: userInfo.nickname || '',
          avatar: userInfo.avatar || '',
          gender: userInfo.gender || 0,
          birthday: userInfo.birthday ? new Date(userInfo.birthday).toISOString().split('T')[0] : '',
        },
        genderText: this.getGenderText(userInfo.gender || 0),
      });
    }
  },

  getGenderText(gender) {
    const map = { 0: '未知', 1: '男', 2: '女' };
    return map[gender] || '未知';
  },

  async chooseAvatar() {
    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      });

      const tempFilePath = res.tempFilePaths[0];

      const fileInfo = await wx.getFileInfo({ filePath: tempFilePath });
      console.log('图片大小:', (fileInfo.size / 1024).toFixed(2) + 'KB');

      if (fileInfo.size > 10 * 1024 * 1024) {
        showToast('图片过大，请选择10MB以内的图片');
        return;
      }

      showLoading('上传中...');

      const uploadRes = await this.uploadImage(tempFilePath);

      hideLoading();

      this.setData({
        'userInfo.avatar': uploadRes.data.url,
      });

      showToast('头像上传成功', 'success');
    } catch (error) {
      hideLoading();
      console.error('上传头像失败', error);
      showToast('上传失败，请重试');
    }
  },

  uploadImage(filePath) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync(STORAGE_KEYS.TOKEN);

      wx.uploadFile({
        url: API_BASE_URL.replace('/api', '') + '/api/upload/image',
        filePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
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
  },

  onNicknameChange(e) {
    this.setData({
      'userInfo.nickname': e.detail,
    });
  },

  showGenderPicker() {
    this.setData({
      genderPickerShow: true,
    });
  },

  closeGenderPicker() {
    this.setData({
      genderPickerShow: false,
    });
  },

  onGenderConfirm(e) {
    console.log('性别选择事件:', JSON.stringify(e.detail));
    
    let gender, text;
    
    if (e.detail.value && typeof e.detail.value === 'object') {
      gender = e.detail.value.value;
      text = e.detail.value.text;
    } else if (e.detail.index !== undefined) {
      const item = this.data.genderColumns[e.detail.index];
      gender = item.value;
      text = item.text;
    } else {
      gender = e.detail;
      text = this.getGenderText(e.detail);
    }
    
    this.setData({
      'userInfo.gender': gender,
      genderText: text,
      genderPickerShow: false,
    });
  },

  onBirthdayChange(e) {
    this.setData({
      'userInfo.birthday': e.detail.value,
    });
  },

  async onSave() {
    const { userInfo } = this.data;

    if (!userInfo.nickname || !userInfo.nickname.trim()) {
      showToast('请输入昵称');
      return;
    }

    this.setData({ saving: true });

    try {
      const updateData = {
        nickname: userInfo.nickname.trim(),
        avatar: userInfo.avatar,
        gender: Number(userInfo.gender) || 0,
      };

      if (userInfo.birthday) {
        updateData.birthday = userInfo.birthday;
      }

      console.log('保存用户信息:', updateData);

      const res = await request.patch('/users/profile', updateData);

      console.log('保存响应:', res);

      const oldUserInfo = wx.getStorageSync(STORAGE_KEYS.USER_INFO) || {};
      const updatedUserInfo = {
        ...oldUserInfo,
        nickname: updateData.nickname,
        avatar: updateData.avatar,
        gender: updateData.gender,
        birthday: updateData.birthday,
      };
      
      if (res.data) {
        Object.assign(updatedUserInfo, res.data);
      }
      
      wx.setStorageSync(STORAGE_KEYS.USER_INFO, updatedUserInfo);

      if (getApp().globalData) {
        getApp().globalData.userInfo = updatedUserInfo;
      }

      showToast('保存成功', 'success');

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('保存失败', error);
      showToast(error.message || '保存失败');
    } finally {
      this.setData({ saving: false });
    }
  },
});
