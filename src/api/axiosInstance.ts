import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'X-CSRFToken': getCookie('csrftoken'),
  },
});

export default axiosInstance;

function getCookie(name: string): string | null {
  // Retrieves a cookie value by name
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}
