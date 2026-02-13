import request from '../utils/request';

export default {
  getList(params) {
    return request.get('/moments', params);
  },

  getById(id) {
    return request.get(`/moments/${id}`);
  },

  create(data) {
    return request.post('/moments', data);
  },
};
