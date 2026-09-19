import axiosClient from './axiosClient';

export const recognitionApi = {
  give: (data) => axiosClient.post('/recognition', data),
  getFeed: () => axiosClient.get('/recognition/feed'),
  getBudget: (employeeId) => axiosClient.get('/recognition/budget', { params: { employeeId } }),
  getLeaderboard: () => axiosClient.get('/recognition/leaderboard'),
  toggleLike: (id, employeeId) => axiosClient.put(`/recognition/${id}/like`, null, { params: { employeeId } }),
};