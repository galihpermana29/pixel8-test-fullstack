import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface ApiConfig extends AxiosRequestConfig {}

const createAPI = (
  baseURL: string = 'https://api.github.com',
  config: ApiConfig = {}
): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },

    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};

const api = createAPI;

export default api;
