import request from '../utils/request';

export default {
  getMy() {
    return request.get('/couples/my');
  },

  create(data) {
    return request.post('/couples', data);
  },

  join(inviteCode) {
    return request.post('/couples/join', { inviteCode });
  },

  generateInviteCode() {
    return request.post('/couples/invite-code');
  },

  getById(id) {
    return request.get(`/couples/${id}`);
  },
};
