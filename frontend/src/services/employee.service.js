import { employeeApi } from '../api/employee.api';

export const employeeService = {
  async list({ page = 0, size = 10, keyword, departmentId, positionId, employmentType, status, sortBy = 'id', direction = 'asc' } = {}) {
    const res = await employeeApi.getAll({ page, size, keyword, departmentId, positionId, employmentType, status, sortBy, direction });
    return res.data; // PageResponse<EmployeeResponse>
  },

  async get(id) {
    const res = await employeeApi.getById(id);
    return res.data;
  },

  // Full create flow: basic info -> employment details -> org assignment.
  // Each step is optional past step 1 so a minimal employee can still be saved.
  async createFull({ basic, employment, organization }) {
    const created = await employeeApi.create(basic);
    let employee = created.data;

    if (employment) {
      const updated = await employeeApi.update(employee.id, { ...basic, ...employment });
      employee = updated.data;
    }
    if (organization?.companyId && organization?.branchId && organization?.departmentId && organization?.positionId) {
      const assigned = await employeeApi.assignOrganization(employee.id, organization);
      employee = assigned.data;
    }
    return employee;
  },

  async updateFull(id, { basic, employment, organization }) {
    const updated = await employeeApi.update(id, { ...basic, ...employment });
    let employee = updated.data;

    if (organization?.companyId && organization?.branchId && organization?.departmentId && organization?.positionId) {
      const assigned = await employeeApi.assignOrganization(id, organization);
      employee = assigned.data;
    }
    return employee;
  },

  async changeStatus(id, payload) {
    const res = await employeeApi.changeStatus(id, payload);
    return res.data;
  },

  async remove(id) {
    await employeeApi.remove(id);
  },

  async getEmergencyContact(id) {
    try {
      const res = await employeeApi.getEmergencyContact(id);
      return res.data;
    } catch {
      return null; // none saved yet
    }
  },

  async saveEmergencyContact(id, payload) {
    const res = await employeeApi.saveEmergencyContact(id, payload);
    return res.data;
  },
  // add this method to the employeeService object
 // src/services/employee.service.js — add this method
  async linkUserAccount(id, userId) {
    const current = await this.get(id);
    const res = await employeeApi.update(id, {
      employeeCode: current.employeeCode,
      firstName: current.firstName,
      lastName: current.lastName,
      email: current.email,
      phone: current.phone,
      dateOfBirth: current.dateOfBirth,
      gender: current.gender,
      hireDate: current.hireDate,
      address: current.address,
      employmentType: current.employmentType,
      probationEndDate: current.probationEndDate,
      contractStartDate: current.contractStartDate,
      contractEndDate: current.contractEndDate,
      userId,
    });
    return res.data;
  },
  async unlinkUser(id) {
  await employeeApi.unlinkUser(id);
},
async uploadPhoto(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await employeeApi.uploadPhoto(id, formData);
  return res.data; // updated EmployeeResponse (includes new photoUrl)
},
async getMyTeam() {
  const res = await employeeApi.getMyTeam();
  return res.data || [];
},
};