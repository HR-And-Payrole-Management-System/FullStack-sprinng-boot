import axiosClient from './axiosClient';

export const billingApi = {
  getSubscription: () => axiosClient.get('/billing/subscription'),
  getPlans: () => axiosClient.get('/billing/plans'),
  changePlan: (planKey) => axiosClient.post('/billing/change-plan', { planKey }),
  cancel: () => axiosClient.post('/billing/cancel'),
  getInvoices: () => axiosClient.get('/billing/invoices'),
  getSummary: () => axiosClient.get('/billing/summary'),
};