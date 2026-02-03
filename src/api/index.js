// API Utilities for Mobile App
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

// Base URL - استخدم نفس Backend
const API_BASE_URL = __DEV__
  ? 'http://localhost:4000/api'  // Development - قد تحتاج تغيير IP
  : Constants.expoConfig?.extra?.apiUrl || 'https://construction-backend-nw0g.onrender.com/api';

// إنشاء axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor لإضافة Token تلقائياً
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor لمعالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token منتهي أو غير صالح
      await removeToken();
      await removeUser();
      // يمكن إضافة navigation هنا لإعادة توجيه لشاشة Login
    }
    return Promise.reject(error);
  }
);

// Token Management
export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('jwtToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('jwtToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('jwtToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// User Management
export const setUser = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getGoogleAuthUrl: () => api.get('/auth/google/url'),
  googleCallback: (code, role) => api.post('/auth/google/callback', { code, role }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, email, password) =>
    api.post('/auth/reset-password', { token, email, password }),
};

// Projects API
export const projectsAPI = {
  getAll: (filters = {}) => api.get('/projects', { params: filters }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, updateData) => api.put(`/projects/${id}`, updateData),
  remove: (id) => api.delete(`/projects/${id}`),
};

// Users API
export const usersAPI = {
  getAll: (filters = {}) => api.get('/users', { params: filters }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, updateData) => api.put(`/users/${id}`, updateData),
};

// Materials API
export const materialsAPI = {
  getAll: (filters = {}) => api.get('/materials', { params: filters }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (materialData) => api.post('/materials', materialData),
  update: (id, updateData) => api.put(`/materials/${id}`, updateData),
  remove: (id) => api.delete(`/materials/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: (filters = {}) => api.get('/suppliers', { params: filters }),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (supplierData) => api.post('/suppliers', supplierData),
  update: (id, updateData) => api.put(`/suppliers/${id}`, updateData),
  remove: (id) => api.delete(`/suppliers/${id}`),
};

// Purchases API
export const purchasesAPI = {
  getAll: (filters = {}) => api.get('/purchases', { params: filters }),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (purchaseData) => api.post('/purchases', purchaseData),
  update: (id, updateData) => api.put(`/purchases/${id}`, updateData),
  remove: (id) => api.delete(`/purchases/${id}`),
};

// Payments API
export const paymentsAPI = {
  getAll: (filters = {}) => api.get('/payments', { params: filters }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (paymentData) => api.post('/payments', paymentData),
  update: (id, updateData) => api.put(`/payments/${id}`, updateData),
  remove: (id) => api.delete(`/payments/${id}`),
};

// Issues API
export const issuesAPI = {
  getAll: (filters = {}) => api.get('/issues', { params: filters }),
  getById: (id) => api.get(`/issues/${id}`),
  create: (issueData) => api.post('/issues', issueData),
  update: (id, updateData) => api.put(`/issues/${id}`, updateData),
  remove: (id) => api.delete(`/issues/${id}`),
};

// Contracts API
export const contractsAPI = {
  getAll: (filters = {}) => api.get('/contracts', { params: filters }),
  getById: (id) => api.get(`/contracts/${id}`),
  create: (contractData) => api.post('/contracts', contractData),
  update: (id, updateData) => api.put(`/contracts/${id}`, updateData),
  remove: (id) => api.delete(`/contracts/${id}`),
};

// Requests API
export const requestsAPI = {
  getAll: (filters = {}) => api.get('/requests', { params: filters }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (requestData) => api.post('/requests', requestData),
  update: (id, updateData) => api.put(`/requests/${id}`, updateData),
  remove: (id) => api.delete(`/requests/${id}`),
};

// Reports API
export const reportsAPI = {
  getAll: (filters = {}) => api.get('/reports', { params: filters }),
  getById: (id) => api.get(`/reports/${id}`),
  create: (reportData) => api.post('/reports', reportData),
  update: (id, updateData) => api.put(`/reports/${id}`, updateData),
  remove: (id) => api.delete(`/reports/${id}`),
  deleteBulk: (ids) => api.post('/reports/bulk-delete', { ids }),
};

// Stripe Payment API
export const stripeAPI = {
  createPaymentIntent: (paymentData) => api.post('/stripe/create-payment-intent', paymentData),
  confirmPayment: (paymentData) => api.post('/stripe/confirm-payment', paymentData),
  getPaymentStatus: (paymentId) => api.get(`/stripe/payment-status/${paymentId}`),
};

export default api;
