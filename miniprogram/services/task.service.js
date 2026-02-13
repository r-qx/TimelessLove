import request from '../utils/request';

export default {
  getList(params) {
    return request.get('/tasks', params);
  },

  getById(id) {
    return request.get(`/tasks/${id}`);
  },

  create(data) {
    return request.post('/tasks', data);
  },

  approve(id) {
    return request.patch(`/tasks/${id}/approve`);
  },

  start(id) {
    return request.patch(`/tasks/${id}/start`);
  },

  complete(id, data) {
    return request.patch(`/tasks/${id}/complete`, data);
  },

  verify(id) {
    return request.patch(`/tasks/${id}/verify`);
  },

  delete(id) {
    return request.delete(`/tasks/${id}`);
  },
};
