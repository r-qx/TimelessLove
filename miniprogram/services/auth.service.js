import request from '../utils/request';

export default {
  wechatLogin(code, userInfo) {
    return request.post('/auth/wechat-login', {
      code,
      nickname: userInfo.nickName,
      avatar: userInfo.avatarUrl,
      gender: userInfo.gender,
    });
  },
};
