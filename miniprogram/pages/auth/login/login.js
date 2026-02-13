import authService from '../../../services/auth.service';
import { STORAGE_KEYS } from '../../../utils/config';

Page({
  data: {
    loading: false,
    agreed: false,
    showAgreement: false,
    showPrivacy: false,
    agreementContent: `欢迎使用 TimelessLove！

本协议是您与 TimelessLove 之间的法律协议。

一、服务说明
TimelessLove 是一款为情侣提供的任务管理和情感记录小程序。用户需通过微信授权登录使用本服务。

二、用户权利
1. 用户享有个人信息的知情权、修改权、删除权
2. 用户可以随时删除账号和数据
3. 用户创建的内容归用户所有

三、用户义务
1. 用户应遵守法律法规，不发布违法违规内容
2. 用户应妥善保管账号信息
3. 用户不得利用本服务从事违法活动

四、服务变更
我们保留在必要时修改或终止服务的权利，将提前通知用户。

五、免责声明
本服务按"现状"提供，我们不对服务的及时性、准确性做出保证。

更新日期：2026年2月`,
    privacyContent: `TimelessLove 隐私政策

我们非常重视您的隐私保护。

一、我们收集的信息
1. 微信昵称和头像（用于展示）
2. 性别和生日（可选）
3. 任务和瞬间内容
4. 设备信息（用于优化服务）

二、信息的使用
仅用于提供和改进服务，与您的情侣对方共享相关内容。
我们承诺不会出售您的个人信息，不会用于推送广告。

三、信息的存储和保护
- 数据存储在腾讯云服务器（中国境内）
- 采用 HTTPS 加密传输
- 数据库访问权限严格控制
- 删除账号后 30 天内可恢复，30 天后永久删除

四、信息的共享
仅在以下情况共享：
1. 与您的情侣对方共享（如任务、瞬间等）
2. 法律法规要求
3. 经您明确同意

五、您的权利
您有权随时查看、修改个人信息，删除内容，注销账号。

六、未成年人保护
如您未满 18 周岁，请在监护人指导下使用。

七、联系我们
如有疑问请通过小程序"帮助与反馈"联系我们。

更新日期：2026年2月`,
  },

  onAgreeChange(e) {
    this.setData({
      agreed: e.detail,
    });
  },

  onLogin() {
    if (this.data.loading) return;

    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议和隐私政策',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    this.setData({ loading: true });

    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (profileRes) => {
        wx.login({
          success: (loginRes) => {
            if (loginRes.code) {
              this.doLogin(loginRes.code, profileRes.userInfo);
            } else {
              wx.showToast({
                title: '登录失败，请重试',
                icon: 'none',
              });
              this.setData({ loading: false });
            }
          },
          fail: (err) => {
            console.error('wx.login 失败', err);
            wx.showToast({
              title: '登录失败: ' + (err.errMsg || '未知错误'),
              icon: 'none',
            });
            this.setData({ loading: false });
          },
        });
      },
      fail: (err) => {
        console.log('用户拒绝授权');
        wx.showToast({
          title: '需要授权才能使用',
          icon: 'none',
        });
        this.setData({ loading: false });
      },
    });
  },

  async doLogin(code, userInfo) {
    try {
      console.log('开始登录，code:', code);
      const loginRes = await authService.wechatLogin(code, userInfo);

      wx.setStorageSync(STORAGE_KEYS.TOKEN, loginRes.data.token);
      wx.setStorageSync(STORAGE_KEYS.USER_INFO, loginRes.data.user);

      wx.showToast({
        title: '登录成功',
        icon: 'success',
      });

      setTimeout(() => {
        if (loginRes.data.user.coupleId) {
          wx.switchTab({ url: '/pages/index/index' });
        } else {
          wx.redirectTo({ url: '/pages/couple/couple' });
        }
      }, 1500);
    } catch (error) {
      console.error('登录失败', error);
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  goToAgreement(e) {
    if (e) {
      e.stopPropagation();
    }
    this.setData({
      showAgreement: true,
    });
  },

  closeAgreement() {
    this.setData({
      showAgreement: false,
    });
  },

  goToPrivacy(e) {
    if (e) {
      e.stopPropagation();
    }
    this.setData({
      showPrivacy: true,
    });
  },

  closePrivacy() {
    this.setData({
      showPrivacy: false,
    });
  },
});
