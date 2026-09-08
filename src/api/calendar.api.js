import axiosClient from './axiosClient';

export const calendarApi = {
  getMonth: (year, month) =>
    axiosClient.get('/calendar', { params: { year, month } }),
};