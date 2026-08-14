import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('buscargo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password, rememberMe = false, adminKey = '', isAdminLogin = false) => api.post('/auth/login', { email, password, rememberMe, adminKey, isAdminLogin });
export const register = (data) => api.post('/auth/register', data);
export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });
export const getCities = () => api.get('/cities');
export const getRoutes = (type, sourceCityId) => api.get('/routes', { params: { type, sourceCityId } });
export const getRoute = (routeId) => api.get(`/routes/${routeId}`);
export const getDepots = () => api.get('/depots');
export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/me');
export const trackParcel = (trackingId) => api.get(`/bookings/${trackingId}/track`);
export const scanQR = (qrCode) => api.post('/depot/scan', { qrCode });
export const confirmDelivery = (trackingId, otp) => api.post('/delivery/confirm', { trackingId, otp });
export const getBusPosition = (busId) => api.get(`/buses/${busId}/position`);
export const getLedger = (parcelId) => api.get(`/ledger/${parcelId}`);
export const getMetrics = () => api.get('/dashboard/metrics');

export default api;
