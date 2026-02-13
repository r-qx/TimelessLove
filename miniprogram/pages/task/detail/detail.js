import taskService from '../../../services/task.service';
import { TASK_TYPE_MAP, TASK_STATUS_MAP, STORAGE_KEYS } from '../../../utils/config';
import { formatTime } from '../../../utils/util';

Page({
  data: {
    id: '',
    task: null,
    loading: true,
    isCreator: false,
    isProofUser: false,
    approving: false,
    starting: false,
    completing: false,
    verifying: false,
    showComplete: false,
    completeContent: '',
    completeImages: [],
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadTask();
    }
  },

  async loadTask() {
    const { id } = this.data;
    
    try {
      const res = await taskService.getById(id);
      const task = res.data;
      
      const userInfo = wx.getStorageSync(STORAGE_KEYS.USER_INFO);
      const userId = userInfo.id || userInfo._id;

      this.setData({
        task: {
          ...task,
          typeText: TASK_TYPE_MAP[task.type] || '未知',
          statusText: TASK_STATUS_MAP[task.status] || '未知',
          deadlineText: task.deadline ? formatTime(task.deadline, 'YYYY-MM-DD HH:mm') : '',
        },
        isCreator: task.creator_id === userId || task.creator_id._id === userId,
        isProofUser: task.proof && (task.proof.user_id === userId || task.proof.user_id._id === userId),
        loading: false,
      });
    } catch (error) {
      console.error('加载任务失败', error);
      this.setData({ loading: false });
      
      wx.showToast({
        title: '任务不存在',
        icon: 'none',
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  async onApprove() {
    const confirmed = await wx.showModal({
      title: '确认同意',
      content: '同意后任务将可以开始执行',
    });

    if (!confirmed.confirm) return;

    this.setData({ approving: true });

    try {
      await taskService.approve(this.data.id);
      
      wx.showToast({
        title: '已同意任务',
        icon: 'success',
      });

      setTimeout(() => {
        this.loadTask();
      }, 1500);
    } catch (error) {
      console.error('同意失败', error);
      wx.showToast({
        title: error.message || '操作失败',
        icon: 'none',
      });
    } finally {
      this.setData({ approving: false });
    }
  },

  async onStart() {
    this.setData({ starting: true });

    try {
      await taskService.start(this.data.id);
      
      wx.showToast({
        title: '任务已开始',
        icon: 'success',
      });

      setTimeout(() => {
        this.loadTask();
      }, 1500);
    } catch (error) {
      console.error('开始失败', error);
      wx.showToast({
        title: error.message || '操作失败',
        icon: 'none',
      });
    } finally {
      this.setData({ starting: false });
    }
  },

  showCompleteDialog() {
    this.setData({
      showComplete: true,
      completeContent: '',
      completeImages: [],
    });
  },

  closeCompleteDialog() {
    this.setData({ showComplete: false });
  },

  onCompleteContentChange(e) {
    this.setData({
      completeContent: e.detail,
    });
  },

  async chooseImage() {
    try {
      const res = await wx.chooseImage({
        count: 3 - this.data.completeImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      });

      this.setData({
        completeImages: [...this.data.completeImages, ...res.tempFilePaths],
      });
    } catch (error) {
      console.log('取消选择图片');
    }
  },

  deleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.completeImages];
    images.splice(index, 1);
    this.setData({ completeImages: images });
  },

  async submitComplete() {
    const { completeContent, completeImages } = this.data;

    if (!completeContent && completeImages.length === 0) {
      wx.showToast({
        title: '请填写完成说明或上传图片',
        icon: 'none',
      });
      return;
    }

    this.setData({ completing: true });

    try {
      const uploadedImages = [];
      
      for (let i = 0; i < completeImages.length; i++) {
        wx.showLoading({
          title: `上传图片 ${i + 1}/${completeImages.length}`,
        });

        const uploadRes = await this.uploadImage(completeImages[i]);
        uploadedImages.push(uploadRes.data.url);
      }

      wx.hideLoading();

      const completeData = {
        content: completeContent,
        media: uploadedImages,
      };

      await taskService.complete(this.data.id, completeData);

      wx.showToast({
        title: '提交成功，等待验收',
        icon: 'success',
      });

      this.setData({ showComplete: false });

      setTimeout(() => {
        this.loadTask();
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      console.error('提交失败', error);
      wx.showToast({
        title: error.message || '提交失败',
        icon: 'none',
      });
    } finally {
      this.setData({ completing: false });
    }
  },

  uploadImage(filePath) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token');
      
      const API_BASE_URL = require('../../../utils/config').API_BASE_URL;
      
      wx.uploadFile({
        url: API_BASE_URL.replace('/api', '') + '/api/upload/image',
        filePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${token}`,
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

  async onVerify() {
    const confirmed = await wx.showModal({
      title: '确认验收',
      content: '确认任务已完成？验收后将发放奖励',
    });

    if (!confirmed.confirm) return;

    this.setData({ verifying: true });

    try {
      await taskService.verify(this.data.id);
      
      wx.showToast({
        title: '验收成功！奖励已发放',
        icon: 'success',
      });

      setTimeout(() => {
        this.loadTask();
      }, 1500);
    } catch (error) {
      console.error('验收失败', error);
      wx.showToast({
        title: error.message || '验收失败',
        icon: 'none',
      });
    } finally {
      this.setData({ verifying: false });
    }
  },
});
