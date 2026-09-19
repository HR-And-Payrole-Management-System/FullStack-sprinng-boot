import { contactApi } from '../api/contact.api';

export const contactService = {
  async submit({ name, email, subject, message }) {
    await contactApi.submit({ name, email, subject, message });
  },
};