import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/v1/Account/Login', JSON.stringify(credentials));
    return response.data;
  },
};

export const elementService = {
  getAll: async () => {
    const response = await api.post('/v1/ElementService/GetAll');
    return response.data;
  },
};
