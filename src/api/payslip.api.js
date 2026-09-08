import axiosClient from './axiosClient';

export const payslipApi = {
  getByPayrollId: (payrollId) => axiosClient.get(`/payslips/${payrollId}`),
};