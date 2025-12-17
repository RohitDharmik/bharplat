import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'https://api.zastang.com/v1', // Replace with your actual API base URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available (e.g., from localStorage or context)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with a status other than 2xx
      const { status, data } = error.response;
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Unauthorized access. Please login again.');
          // You might want to redirect to login page here
          break;
        case 403:
          // Forbidden - no permission
          console.error('You do not have permission to access this resource.');
          break;
        case 404:
          // Not found
          console.error('Resource not found.');
          break;
        case 500:
          // Server error
          console.error('Server error occurred.');
          break;
        default:
          console.error(`Error: ${status} - ${data.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response received from server.');
    } else {
      // Something happened in setting up the request
      console.error(`Error: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const api = {
  // Auth endpoints
  login: (credentials: { email: string; password: string }) => 
    axiosInstance.post('/auth/login', credentials),
  
  // Menu endpoints
  getMenu: () => axiosInstance.get('/menu'),
  createMenuItem: (item: any) => axiosInstance.post('/menu', item),
  updateMenuItem: (id: string, item: any) => axiosInstance.put(`/menu/${id}`, item),
  deleteMenuItem: (id: string) => axiosInstance.delete(`/menu/${id}`),
  
  // Tables endpoints
  getTables: () => axiosInstance.get('/tables'),
  updateTableStatus: (id: string, status: string) => 
    axiosInstance.put(`/tables/${id}/status`, { status }),
  
  // Orders endpoints
  getOrders: () => axiosInstance.get('/orders'),
  createOrder: (order: any) => axiosInstance.post('/orders', order),
  updateOrderStatus: (id: string, status: string) => 
    axiosInstance.put(`/orders/${id}/status`, { status }),
  
  // Users endpoints
  getUsers: () => axiosInstance.get('/users'),
  createUser: (user: any) => axiosInstance.post('/users', user),
  
  // Inventory endpoints
  getInventory: () => axiosInstance.get('/inventory'),
  createInventoryItem: (item: any) => axiosInstance.post('/inventory', item),
  
  // Reservations endpoints
  getReservations: () => axiosInstance.get('/reservations'),
  createReservation: (reservation: any) => axiosInstance.post('/reservations', reservation),
  
  // Feedback endpoints
  getFeedback: () => axiosInstance.get('/feedback'),
  createFeedback: (feedback: any) => axiosInstance.post('/feedback', feedback),
  
  // Tickets endpoints
  getTickets: () => axiosInstance.get('/tickets'),
  createTicket: (ticket: any) => axiosInstance.post('/tickets', ticket),
  
  // Customers endpoints
  getCustomers: () => axiosInstance.get('/customers'),
  createCustomer: (customer: any) => axiosInstance.post('/customers', customer),
  
  // Reports endpoints
  getReports: (params: any) => axiosInstance.get('/reports', { params }),
  
  // Payments endpoints
  processPayment: (payment: any) => axiosInstance.post('/payments', payment),
  getPaymentHistory: () => axiosInstance.get('/payments/history'),
  
  // Recipes endpoints
  getRecipes: () => axiosInstance.get('/recipes'),
  createRecipe: (recipe: any) => axiosInstance.post('/recipes', recipe),
  
  // Purchase endpoints
  getPurchases: () => axiosInstance.get('/purchases'),
  createPurchase: (purchase: any) => axiosInstance.post('/purchases', purchase),
};

export default axiosInstance;
