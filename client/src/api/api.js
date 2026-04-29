import axios from 'axios';
// console.log('API URL:', import.meta.env.VITE_API_URL); // Debugging line to check the API URL

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Pulls from your .env file
  withCredentials: true, // Crucial for sending JWT cookies later
});

export default api;