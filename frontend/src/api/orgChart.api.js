import axiosClient from "./axiosClient";

export const orgChartApi = {
    getCompanyChart: (companyId) => axiosClient.get(`/org-chart/company/${companyId}`),
    getSubtree: (employeeId) => axiosClient.get(`/org-chart/employee`)
}