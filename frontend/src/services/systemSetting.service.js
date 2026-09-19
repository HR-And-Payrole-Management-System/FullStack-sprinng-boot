import { systemSettingApi } from '../api/systemSetting.api';

export const systemSettingService = {
  async list() {
    const res = await systemSettingApi.getAll();
    return res.data || [];
  },

  async updateValue(key, settingValue) {
    const res = await systemSettingApi.updateValue(key, { settingValue });
    return res.data;
  },

  async upsert({ settingKey, settingValue, category, dataType, description }) {
    const res = await systemSettingApi.upsert({ settingKey, settingValue, category, dataType, description });
    return res.data;
  },

  async remove(key) {
    await systemSettingApi.remove(key);
  },
};