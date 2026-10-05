import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5148/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
})

// Optional request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  // If accessToken exists in localStorage or cookies, attach here
  return config
})

export default apiClient
