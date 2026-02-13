import { LEVEL_NAMES, TASK_TYPE_MAP } from '../../utils/config';
import { calculateDays, formatRelativeTime } from '../../utils/util';
import coupleService from '../../services/couple.service';
import taskService from '../../services/task.service';
import momentService from '../../services/moment.service';

Page({
  data: {
    coupleInfo: null,
    levelName: '',
    progress: 0,
    togetherDays: 0,
    tasks: [],
    moments: [],
    loading: false,
  },

  goToLogin() {
    wx.redirectTo({ url: '/pages/auth/login/login' });
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    
    if (token) {
      console.log('已登录，加载数据');
      this.loadData();
    } else {
      console.log('未登录，显示游客模式');
      this.setData({
        coupleInfo: null,
        loading: false,
      });
    }
  },

  onShow() {
    const token = wx.getStorageSync('token');
    
    if (token && this.data.coupleInfo) {
      this.loadCoupleInfo();
      this.loadTasks();
    }
  },

  async loadData() {
    this.setData({ loading: true });
    wx.showLoading({ title: '加载中...' });
    try {
      await this.loadCoupleInfo();
      await this.loadTasks();
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      wx.hideLoading();
      this.setData({ loading: false });
    }
  },

  async loadCoupleInfo() {
    try {
      const res = await coupleService.getMy();
      const coupleInfo = res.data;
      
      this.setData({
        coupleInfo,
        levelName: LEVEL_NAMES[coupleInfo.level - 1] || '新手情侣',
        togetherDays: calculateDays(coupleInfo.anniversary),
        progress: this.calculateProgress(coupleInfo.level, coupleInfo.love_points),
      });
    } catch (error) {
      console.error('获取情侣信息失败', error);
      
      if (error.code === 40400) {
        wx.showModal({
          title: '提示',
          content: '您还没有建立情侣关系，是否前往配对？',
          success: (res) => {
            if (res.confirm) {
              wx.redirectTo({ url: '/pages/couple/couple' });
            }
          },
        });
      }
    }
  },

  async loadTasks() {
    try {
      const res = await taskService.getList({
        status: 'in_progress',
        limit: 3,
      });
      
      const tasks = res.data.list.map(task => ({
        ...task,
        typeText: TASK_TYPE_MAP[task.type],
        deadlineText: formatRelativeTime(task.deadline),
      }));
      
      this.setData({ tasks });
    } catch (error) {
      console.error('获取任务列表失败', error);
    }
  },


  calculateProgress(level, points) {
    const levels = [
      0, 100, 200, 350, 550, 800, 1100, 1450, 1850, 2300,
      2800, 3350, 3950, 4600, 5300, 6050, 6850, 7700, 8600, 9550,
      11000, 12500, 14050, 15650, 17300, 20000, 25000, 32000, 40000, 50000,
    ];
    
    if (level >= 30) return 100;
    
    const currentLevelPoints = levels[level - 1];
    const nextLevelPoints = levels[level];
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  },

  showComingSoon() {
    wx.showToast({
      title: '功能开发中，敬请期待',
      icon: 'none',
      duration: 2000,
    });
  },

  goToTaskList() {
    wx.switchTab({ url: '/pages/task/list/list' });
  },

  goToTaskDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/task/detail/detail?id=${id}` });
  },

  goToTimeline() {
    wx.switchTab({ url: '/pages/timeline/timeline' });
  },
});
