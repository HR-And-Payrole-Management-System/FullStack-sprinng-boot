import axiosClient from './axiosClient';

export const workforceApi = {
  getTrend: () => axiosClient.get('/dashboard/workforce/trend'),
  getAttritionByDepartment: () => axiosClient.get('/dashboard/workforce/attrition-by-department'),
  getAttritionByPosition: () => axiosClient.get('/dashboard/workforce/attrition-by-position'),
  getAgeGroups: () => axiosClient.get('/dashboard/workforce/age-groups'),
  getGenderDiversity: () => axiosClient.get('/dashboard/workforce/gender-diversity'),
  getTenureDistribution: () => axiosClient.get('/dashboard/workforce/tenure-distribution'),
};