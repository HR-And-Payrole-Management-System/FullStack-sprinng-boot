import { salaryStructureApi } from '../api/salaryStructure.api';
import { employeeSalaryApi } from '../api/employeeSalary.api';
import { payrollApi } from '../api/payroll.api';
import { payslipApi } from '../api/payslip.api';

export const salaryStructureService = {
  async list() {
    const res = await salaryStructureApi.getAll();
    return res.data || [];
  },
  async create(payload) {
    const res = await salaryStructureApi.create(payload);
    return res.data;
  },
};

export const employeeSalaryService = {
  async assign(employeeId, payload) {
    const res = await employeeSalaryApi.assign(employeeId, payload);
    return res.data;
  },
  async getHistory(employeeId) {
    const res = await employeeSalaryApi.getHistory(employeeId);
    return res.data || [];
  },
  async remove(id) {
    await employeeSalaryApi.remove(id);
  },
};

export const payrollService = {
  async list() {
    const res = await payrollApi.getAll();
    return res.data || [];
  },
  async generate(payload) {
    const res = await payrollApi.generate(payload);
    return res.data;
  },
  async approve(id) {
    const res = await payrollApi.approve(id);
    return res.data;
  },
  async markPaid(id) {
    const res = await payrollApi.markPaid(id);
    return res.data;
  },
};

export const payslipService = {
  async get(payrollId) {
    const res = await payslipApi.getByPayrollId(payrollId);
    return res.data;
  },
};