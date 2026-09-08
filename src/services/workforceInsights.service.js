import { workforceApi } from '../api/workforce.api';

// Charts return raw arrays [{ name, value }], not wrapped in ApiResponse —
// same shape dashboard.service.js already relies on.
export const workforceInsightsService = {
  async loadAll() {
    const [trend, attritionByDept, attritionByPosition, ageGroups, gender, tenure] =
      await Promise.all([
        workforceApi.getTrend().catch(() => ({ data: [] })),
        workforceApi.getAttritionByDepartment().catch(() => ({ data: [] })),
        workforceApi.getAttritionByPosition().catch(() => ({ data: [] })),
        workforceApi.getAgeGroups().catch(() => ({ data: [] })),
        workforceApi.getGenderDiversity().catch(() => ({ data: [] })),
        workforceApi.getTenureDistribution().catch(() => ({ data: [] })),
      ]);

    return {
      trend: trend.data ?? trend,
      attritionByDept: attritionByDept.data ?? attritionByDept,
      attritionByPosition: attritionByPosition.data ?? attritionByPosition,
      ageGroups: ageGroups.data ?? ageGroups,
      gender: gender.data ?? gender,
      tenure: tenure.data ?? tenure,
    };
  },
};