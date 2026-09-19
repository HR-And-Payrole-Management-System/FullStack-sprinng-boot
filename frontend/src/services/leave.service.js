import { leaveApi } from '../api/leave.api';

export const leaveService = {
  async listByEmployee(employeeId, page = 0, size = 10) {
    const res = await leaveApi.getByEmployeeId(employeeId, page, size);
    return res.data; // PageResponse<LeaveRequestResponse>
  },
  async create(employeeId, payload) {
    const res = await leaveApi.create(employeeId, payload);
    return res.data;
  },
  async approve(id, comment) {
    const res = await leaveApi.approve(id, { comment });
    return res.data;
  },
  async reject(id, comment) {
    const res = await leaveApi.reject(id, { comment });
    return res.data;
  },
  async cancel(id) {
    const res = await leaveApi.cancel(id);
    return res.data;
  },
};