import axiosClient from './axiosClient';

export const employeeSalaryApi = {
  assign: (employeeId, data) => axiosClient.post(`/employee-salaries/employees/${employeeId}`, data),
  getHistory: (employeeId) => axiosClient.get(`/employee-salaries/employees/${employeeId}`),
  remove: (id) => axiosClient.delete(`/employee-salaries/${id}`),
};