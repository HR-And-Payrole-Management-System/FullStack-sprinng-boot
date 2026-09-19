import { calendarApi } from '../api/calendar.api';

export const calendarService = {
  async fetchMonth(year, month) {
    const res = await calendarApi.getMonth(year, month);
    return res.data || [];
  },
};