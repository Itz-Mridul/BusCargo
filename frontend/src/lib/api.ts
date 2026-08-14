import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('buscargo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email: string, password: string, rememberMe = false) => api.post('/auth/login', { email, password, rememberMe });
export const register = (data: { name: string; email: string; password: string }) => api.post('/auth/register', data);
export const getCities = () => api.get('/cities');
export const getRoutes = (type: string, sourceCityId: string) => api.get('/routes', { params: { type, sourceCityId } });
export const getRoute = (routeId: string) => api.get(`/routes/${routeId}`);
export const getDepots = () => api.get('/depots');
export const createBooking = (data: Record<string, unknown>) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/me');
export const trackParcel = (trackingId: string) => api.get(`/bookings/${trackingId}/track`);
export const scanQR = (qrCode: string) => api.post('/depot/scan', { qrCode });
export const confirmDelivery = (trackingId: string, otp: string) => api.post('/delivery/confirm', { trackingId, otp });
export const getBusPosition = (busId: string) => api.get(`/buses/${busId}/position`);
export const getLedger = (parcelId: string) => api.get(`/ledger/${parcelId}`);
export const getMetrics = () => api.get('/dashboard/metrics');

export default api;
