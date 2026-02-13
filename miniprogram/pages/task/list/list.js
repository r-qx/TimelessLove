import taskService from '../../../services/task.service';
import { TASK_TYPE_MAP } from '../../../utils/config';
import { formatRelativeTime } from '../../../utils/util';

Page({
  data: {
    activeTab: 'in_progress',
    tasks: [],
    loading: false,
    refreshing: false,
    page: 1,
    pageSize: 20,
    noMore: false,
  },

  onLoad() {
    this.loadTasks();
  },

  onTabChange(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({
      activeTab: name,
      tasks: [],
      page: 1,
      noMore: false,
    });
    this.loadTasks();
  },

  async loadTasks() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const res = await taskService.getList({
        status: this.data.activeTab,
        limit: this.data.pageSize,
        offset: (this.data.page - 1) * this.data.pageSize,
      });

      const tasks = res.data.list.map(task => ({
        ...task,
        typeText: TASK_TYPE_MAP[task.type],
        deadlineText: task.deadline ? formatRelativeTime(task.deadline) : '',
      }));

      this.setData({
        tasks: this.data.page === 1 ? tasks : [...this.data.tasks, ...tasks],
        noMore: tasks.length < this.data.pageSize,
      });
    } catch (error) {
      console.error('获取任务列表失败', error);
    } finally {
      this.setData({ loading: false, refreshing: false });
    }
  },

  loadMore() {
    if (this.data.noMore || this.data.loading) return;
    
    this.setData({ page: this.data.page + 1 });
    this.loadTasks();
  },

  onRefresh() {
    this.setData({
      refreshing: true,
      page: 1,
      noMore: false,
    });
    this.loadTasks();
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/task/detail/detail?id=${id}`,
    });
  },

  goToCreate() {
    wx.navigateTo({
      url: '/pages/task/create/create',
    });
  },

  goToTemplate() {
    wx.navigateTo({
      url: '/pages/task/template/template',
    });
  },
});
