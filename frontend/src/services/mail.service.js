import { mailApi } from '../api/mail.api';

export const mailService = {
  async send(data) {
    const res = await mailApi.send(data);
    return res.data;
  },
  async fetchInbox(page = 0, size = 10) {
    const res = await mailApi.getInbox({ page, size });
    return res.data;
  },
  async fetchSent(page = 0, size = 10) {
    const res = await mailApi.getSent({ page, size });
    return res.data;
  },
  async fetchById(id) {
    const res = await mailApi.getById(id);
    return res.data;
  },
  async unreadCount() {
    const res = await mailApi.unreadCount();
    return res.data || 0;
  },
  async remove(id) {
    await mailApi.remove(id);
  },

  async fetchThreads(page = 0, size = 15) {
    const res = await mailApi.getThreads({ page, size });
    return res.data;
  },
  async fetchThread(threadId) {
    const res = await mailApi.getThread(threadId);
    return res.data || [];
  },
  async uploadAttachment(messageId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await mailApi.addAttachment(messageId, formData);
    return res.data;
  },
  async removeAttachment(messageId, attachmentId) {
    await mailApi.removeAttachment(messageId, attachmentId);
  },
};