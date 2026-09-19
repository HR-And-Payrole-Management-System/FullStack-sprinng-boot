import { locationApi } from '../api/location.api';

const buildPayload = ({
  name, branchId, addressLine1, addressLine2, city, state, country,
  postalCode, latitude, longitude, primary, status,
}) => ({
  name,
  branchId: branchId ? Number(branchId) : null,
  addressLine1,
  addressLine2,
  city,
  state,
  country,
  postalCode,
  latitude: latitude === '' || latitude === undefined || latitude === null ? null : Number(latitude),
  longitude: longitude === '' || longitude === undefined || longitude === null ? null : Number(longitude),
  primary: !!primary,
  status: status || null,
});

export const locationService = {
  async list() {
    const res = await locationApi.getAll();
    return res.data || [];
  },

  async create(values) {
    const res = await locationApi.create(buildPayload(values));
    return res.data;
  },

  async update(id, values) {
    const res = await locationApi.update(id, buildPayload(values));
    return res.data;
  },

  async remove(id) {
    await locationApi.remove(id);
  },
};