import { TASK_TEMPLATES, TEMPLATE_CATEGORIES } from '../../../data/task-templates';

Page({
  data: {
    categories: TEMPLATE_CATEGORIES,
    templates: TASK_TEMPLATES,
    filteredTemplates: TASK_TEMPLATES,
    currentCategory: 'all',
  },

  onLoad() {
    this.filterTemplates('all');
  },

  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.filterTemplates(category);
  },

  filterTemplates(category) {
    if (category === 'all') {
      this.setData({ filteredTemplates: this.data.templates });
    } else {
      const filtered = this.data.templates.filter(t => t.category === category);
      this.setData({ filteredTemplates: filtered });
    }
  },

  onTemplateSelect(e) {
    const template = e.currentTarget.dataset.template;
    
    wx.navigateTo({
      url: `/pages/task/create/create?templateId=${template.id}`,
    });
  },
});
