import { companyApi } from '../api/company.api';

export const companyService = {
  async list() {
    const res = await companyApi.list();
    return res.data;
  },
  async getById(id) {
    const res = await companyApi.getById(id);
    return res.data;
  },
  async create(payload) {
    const res = await companyApi.create(payload);
    return res.data;
  },
  async update(id, payload) {
    const res = await companyApi.update(id, payload);
    return res.data;
  },
  async remove(id) {
    await companyApi.remove(id);
  },
  async uploadLogo(id, file) {
  const res = await companyApi.uploadLogo(id, file);
  return res.data;
},
};