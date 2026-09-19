import { billingApi } from '../api/billing.api';

export const billingService = {
  async subscription() {
    const res = await billingApi.getSubscription();
    return res.data;
  },
  async plans() {
    const res = await billingApi.getPlans();
    return res.data || [];
  },
  async changePlan(planKey) {
    const res = await billingApi.changePlan(planKey);
    return res.data;
  },
  async cancel() {
    const res = await billingApi.cancel();
    return res.data;
  },
  async invoices() {
    const res = await billingApi.getInvoices();
    return res.data || [];
  },
  async summary() {
    const res = await billingApi.getSummary();
    return res.data;
  },
};