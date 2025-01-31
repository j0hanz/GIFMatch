import axiosInstance from './axiosInstance';

export const login = async (username: string, password: string) => {
  // Sends login request
  const response = await axiosInstance.post('dj-rest-auth/login/', {
    username,
    password,
  });
  return response.data;
};

export const logout = async () => {
  // Sends logout request
  const csrfToken = getCookie('csrftoken');
  const response = await axiosInstance.post(
    'dj-rest-auth/logout/',
    {},
    {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    },
  );
  return response.data;
};

export const register = async (
  username: string,
  email: string,
  password1: string,
  password2: string,
) => {
  // Registers a new user
  const response = await axiosInstance.post('dj-rest-auth/registration/', {
    username,
    email,
    password1,
    password2,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  // Fetches current authenticated user
  const response = await axiosInstance.get('dj-rest-auth/user/');
  return response.data;
};

function getCookie(name: string): string | null {
  // Retrieves a cookie value by name
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}
