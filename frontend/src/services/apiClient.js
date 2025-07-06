import axios from 'axios';

// Determine the base URL for the API
// In development, this might point to your local FastAPI server.
// In production, this would be your deployed backend URL.
// You can use environment variables for this.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // You can add other default headers here if needed, e.g., for authentication
    // 'Authorization': `Bearer ${token}`
  },
});

// You can also add interceptors for requests or responses if needed globally
// For example, to handle errors or add auth tokens to every request

// Request interceptor (example: could be used for adding auth tokens)
// apiClient.interceptors.request.use(
//   (config) => {
//     // const token = localStorage.getItem('authToken'); // Example: get token
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor (example: for global error handling)
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle global errors, e.g., 401 Unauthorized, network errors
//     if (error.response && error.response.status === 401) {
//       // console.error("Unauthorized access - redirecting to login or refreshing token");
//       // window.location.href = '/login'; // Example redirect
//     }
//     // You might want to avoid rejecting here if you handle errors locally in components/services
//     return Promise.reject(error);
//   }
// );

export default apiClient;
```
