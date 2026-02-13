import coupleService from '../../services/couple.service';
import { showToast, showLoading, hideLoading } from '../../utils/util';

Page({
  data: {
    activeTab: 'create',
    anniversary: '',
    inviteCode: '',
    inputCode: '',
    existingCouple: null,
  },

  onLoad() {
    this.checkExistingCouple();
  },

  async checkExistingCouple() {
    try {
      const res = await coupleService.getMy();
      const couple = res.data;
      
      if (couple && couple.status === 'pending') {
        this.setData({
          existingCouple: couple,
          inviteCode: couple.inviteCode || '',
          anniversary: couple.anniversary ? new Date(couple.anniversary).toISOString().split('T')[0] : '',
        });
        
        if (couple.inviteCode) {
          console.log('✅ 已有待配对的关系，邀请码:', couple.inviteCode);
        }
      }
    } catch (error) {
      console.log('暂无情侣关系，可以创建新的');
    }
  },

  switchTab(e) {
    this.setData({
      activeTab: e.currentTarget.dataset.tab,
    });
  },

  onDateChange(e) {
    this.setData({
      anniversary: e.detail.value,
    });
  },

  onInputChange(e) {
    this.setData({
      inputCode: e.detail.value.toUpperCase(),
    });
  },

  async onCreate() {
    const { anniversary } = this.data;

    if (!anniversary) {
      showToast('请选择恋爱纪念日');
      return;
    }

    showLoading('创建中...');

    try {
      const isoDate = new Date(anniversary).toISOString();
      console.log('准备创建情侣关系:', { 
        原始日期: anniversary, 
        ISO日期: isoDate 
      });
      
      const res = await coupleService.create({ anniversary: isoDate });
      console.log('创建情侣关系成功', res);
      
      hideLoading();
      
      const inviteCode = res.data.inviteCode;
      
      this.setData({
        inviteCode: inviteCode,
        existingCouple: res.data,
      });

      showToast('创建成功！请将邀请码发送给TA', 'success');
    } catch (error) {
      hideLoading();
      console.error('创建失败', error);
      showToast(error.message || '创建失败');
    }
  },

  async onJoin() {
    const { inputCode } = this.data;

    if (!inputCode || inputCode.length !== 8) {
      showToast('请输入正确的8位邀请码');
      return;
    }

    showLoading('加入中...');

    try {
      await coupleService.join(inputCode);
      
      hideLoading();
      showToast('配对成功！', 'success');

      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
    } catch (error) {
      hideLoading();
      console.error('加入失败', error);
      showToast(error.message || '加入失败');
    }
  },

  onCopy(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => {
        showToast('邀请码已复制', 'success');
      },
    });
  },
});
