import { employeeDocumentApi } from '../api/employeeDocument.api';
import { documentTypeApi } from '../api/documentType.api';

export const employeeDocumentService = {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await employeeDocumentApi.upload(formData);
    return res.data;
  },
  async create(employeeId, data) {
    const res = await employeeDocumentApi.create(employeeId, data);
    return res.data;
  },
  async fetchByEmployee(employeeId) {
    const res = await employeeDocumentApi.getByEmployee(employeeId);
    return res.data || [];
  },
  async fetchById(id) {
    const res = await employeeDocumentApi.getById(id);
    return res.data;
  },
  async update(id, data) {
    const res = await employeeDocumentApi.update(id, data);
    return res.data;
  },
  async verify(id, data) {
    const res = await employeeDocumentApi.verify(id, data);
    return res.data;
  },
  async fetchExpiring(startDate, endDate) {
    const res = await employeeDocumentApi.getExpiring(startDate, endDate);
    return res.data || [];
  },
    async markExpired() {
    const res = await employeeDocumentApi.markExpired();
    return res.data || 0;
  },
  async markExpiringSoon(days = 7) {
    const res = await employeeDocumentApi.markExpiringSoon(days);
    return res.data || 0;
  },
  async remove(id) {
    await employeeDocumentApi.remove(id);
  },
  async fetchTypes() {
    const res = await documentTypeApi.getAll();
    return res.data || [];
  },
  
};