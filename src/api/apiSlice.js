import apiClient from './apiClient';

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  fetchProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  }
};

export const productApi = {
  list: async (params) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  getFeatured: async () => {
    const response = await apiClient.get('/products/featured');
    return response.data;
  },
  getBestSelling: async () => {
    const response = await apiClient.get('/products/best-selling');
    return response.data;
  },
  addReview: async (id, payload) => {
    const response = await apiClient.post(`/products/${id}/reviews`, payload);
    return response.data;
  }
};

export const cartApi = {
  fetchCart: async () => {
    const response = await apiClient.get('/orders/cart');
    return response.data;
  },
  addToCart: async (product_id, quantity = 1) => {
    const response = await apiClient.post('/orders/cart', { product_id, quantity });
    return response.data;
  },
  updateCartItem: async (product_id, quantity) => {
    const response = await apiClient.put(`/orders/cart/${product_id}`, { quantity });
    return response.data;
  },
  removeFromCart: async (product_id) => {
    const response = await apiClient.delete(`/orders/cart/${product_id}`);
    return response.data;
  }
};

export const wishlistApi = {
  fetchWishlist: async () => {
    const response = await apiClient.get('/orders/wishlist');
    return response.data;
  },
  addToWishlist: async (product_id) => {
    const response = await apiClient.post('/orders/wishlist', { product_id });
    return response.data;
  },
  removeFromWishlist: async (product_id) => {
    const response = await apiClient.delete(`/orders/wishlist/${product_id}`);
    return response.data;
  }
};

export const orderApi = {
  checkout: async (payload) => {
    const response = await apiClient.post('/orders/checkout', payload);
    return response.data;
  },
  fetchOrders: async () => {
    const response = await apiClient.get('/orders/orders');
    return response.data;
  }
};

export const serviceApi = {
  fetchServices: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },
  requestService: async (payload) => {
    const response = await apiClient.post('/services/request', payload);
    return response.data;
  },
  submitInquiry: async (payload) => {
    const response = await apiClient.post('/services/inquiry', payload);
    return response.data;
  }
};

export const adminApi = {
  fetchProducts: async () => {
    const response = await apiClient.get('/admin/products');
    return response.data;
  },
  fetchOrders: async () => {
    const response = await apiClient.get('/admin/orders');
    return response.data;
  },
  fetchUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  fetchServiceRequests: async () => {
    const response = await apiClient.get('/admin/service-requests');
    return response.data;
  }
};
