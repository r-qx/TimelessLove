import taskService from '../../../services/task.service';
import { showToast, showLoading, hideLoading } from '../../../utils/util';
import { TASK_TEMPLATES } from '../../../data/task-templates';

Page({
  data: {
    formData: {
      type: 'personal',
      title: '',
      description: '',
      difficulty: 3,
      reward_points: 20,
      reward_coins: 10,
      deadline: '',
      tags: [],
    },
    isFromTemplate: false,
    difficultyText: {
      1: '简单',
      2: '一般',
      3: '中等',
      4: '困难',
      5: '极难',
    },
    tagOptions: ['日常', '约会', '惊喜', '运动', '学习', '成长', '浪漫', '挑战'],
    showDate: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    submitting: false,
  },

  onLoad(options) {
    if (options.templateId) {
      this.loadTemplate(options.templateId);
    }
  },

  loadTemplate(templateId) {
    const template = TASK_TEMPLATES.find(t => t.id === templateId);
    
    if (template) {
      this.setData({
        formData: {
          type: 'personal',
          title: template.title,
          description: template.description,
          difficulty: template.difficulty,
          reward_points: template.reward_points,
          reward_coins: template.reward_coins,
          deadline: '',
          tags: template.tags || [],
        },
        isFromTemplate: true,
      });

      wx.showToast({
        title: '已加载模板',
        icon: 'success',
        duration: 1500,
      });
    }
  },

  onTypeChange(e) {
    const type = e.currentTarget.dataset.type || e.detail;
    const rewards = {
      personal: { points: 10, coins: 5 },
      cooperation: { points: 30, coins: 15 },
      periodic: { points: 20, coins: 10 },
    };
    
    this.setData({
      'formData.type': type,
      'formData.reward_points': rewards[type]?.points || 20,
      'formData.reward_coins': rewards[type]?.coins || 10,
    });
  },

  onTitleChange(e) {
    this.setData({
      'formData.title': e.detail,
    });
  },

  onDescChange(e) {
    this.setData({
      'formData.description': e.detail,
    });
  },

  onDifficultySelect(e) {
    const level = e.currentTarget.dataset.level;
    this.setData({
      'formData.difficulty': level,
    });
  },

  onPointsChange(e) {
    this.setData({
      'formData.reward_points': e.detail,
    });
  },

  onCoinsChange(e) {
    this.setData({
      'formData.reward_coins': e.detail,
    });
  },

  showDatePicker() {
    this.setData({ showDate: true });
  },

  closeDatePicker() {
    this.setData({ showDate: false });
  },

  onDateConfirm(e) {
    const date = new Date(e.detail);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    const displayStr = `${year}-${month}-${day} ${hour}:${minute}`;
    
    this.setData({
      'formData.deadline': displayStr,
      'formData._deadlineISO': date.toISOString(),
      showDate: false,
    });
  },

  onTagToggle(e) {
    const tag = e.currentTarget.dataset.tag;
    const { tags } = this.data.formData;
    
    let newTags = [...tags];
    const index = newTags.indexOf(tag);
    
    if (index > -1) {
      newTags.splice(index, 1);
    } else {
      if (newTags.length < 3) {
        newTags.push(tag);
      } else {
        showToast('最多选择3个标签');
        return;
      }
    }
    
    this.setData({
      'formData.tags': newTags,
    });
  },

  async onSubmit() {
    const { formData } = this.data;

    if (!formData.title || !formData.title.trim()) {
      showToast('请输入任务标题');
      return;
    }

    if (formData.title.trim().length < 2) {
      showToast('任务标题至少2个字');
      return;
    }

    this.setData({ submitting: true });

    try {
      const createData = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        difficulty: formData.difficulty,
        reward_points: formData.reward_points,
        reward_coins: formData.reward_coins,
        tags: formData.tags,
      };

      if (formData._deadlineISO) {
        createData.deadline = formData._deadlineISO;
      } else if (formData.deadline) {
        createData.deadline = new Date(formData.deadline).toISOString();
      }

      console.log('创建任务数据:', createData);

      const res = await taskService.create(createData);

      hideLoading();
      
      wx.showToast({
        title: '任务创建成功！',
        icon: 'success',
        duration: 2000,
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    } catch (error) {
      hideLoading();
      console.error('创建任务失败', error);
      showToast(error.message || '创建失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  },
});
