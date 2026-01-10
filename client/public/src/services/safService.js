import baseApiService from './baseApiService';

// Get all districts
export const getDistricts = () => {
  return baseApiService.get('/admin/get/districts');
};

// Get mandals by district ID
export const getMandalsByDistrict = (districtId) => {
  return baseApiService.get(`/admin/get/mandals/${districtId}`);
};

// Submit SAF membership form
export const submitMembership = (formData) => {
  return baseApiService.post('/saf/membership/submit', formData);
};

// Get SAF members list with optional filters
export const getMembersList = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.district_id) params.append('district_id', filters.district_id);
  if (filters.mandal_id) params.append('mandal_id', filters.mandal_id);
  
  const queryString = params.toString();
  const url = queryString ? `/saf/members/list?${queryString}` : '/saf/members/list';
  
  return baseApiService.get(url);
};

// Create Razorpay order for payment
export const createPaymentOrder = () => {
  return baseApiService.post('/payment/create-order', {});
};

// Verify payment and submit membership
export const verifyPaymentAndSubmit = (paymentData) => {
  return baseApiService.post('/payment/verify-payment', paymentData);
};

export default {
  getDistricts,
  getMandalsByDistrict,
  submitMembership,
  getMembersList,
  createPaymentOrder,
  verifyPaymentAndSubmit
};

