import axiosClient from './axiosClient';

export const mailApi = {
  send: (data) => axiosClient.post('/messages', data),
  getInbox: (params) => axiosClient.get('/messages/inbox', { params }),
  getSent: (params) => axiosClient.get('/messages/sent', { params }),
  getById: (id) => axiosClient.get(`/messages/${id}`),
  unreadCount: () => axiosClient.get('/messages/unread-count'),
  remove: (id) => axiosClient.delete(`/messages/${id}`),

  getThreads: (params) => axiosClient.get('/messages/threads', { params }),
  getThread: (threadId) => axiosClient.get(`/messages/threads/${threadId}`),

  addAttachment: (messageId, formData) =>
    axiosClient.post(`/messages/${messageId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  removeAttachment: (messageId, attachmentId) =>
    axiosClient.delete(`/messages/${messageId}/attachments/${attachmentId}`),

  broadcast: (data) => axiosClient.post('/messages/broadcast', data),
};