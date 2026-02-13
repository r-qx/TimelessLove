import request from '../utils/request';

export default {
  getMessages(params) {
    return request.get('/chat/messages', params);
  },

  sendMessage(data) {
    return request.post('/chat/messages', data);
  },
};
