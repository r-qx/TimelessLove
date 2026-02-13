import { observable, action } from 'mobx-miniprogram';

export const store = observable({
  userInfo: null,
  coupleInfo: null,
  unreadCount: 0,

  setUserInfo: action(function (info) {
    this.userInfo = info;
  }),

  setCoupleInfo: action(function (info) {
    this.coupleInfo = info;
  }),

  setUnreadCount: action(function (count) {
    this.unreadCount = count;
  }),

  clear: action(function () {
    this.userInfo = null;
    this.coupleInfo = null;
    this.unreadCount = 0;
  }),
});
