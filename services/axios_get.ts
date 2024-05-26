/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@config/firebase';
import axios, { AxiosResponse } from 'axios';

export const axiosGet = async (url: string, params: unknown): Promise<AxiosResponse<any, any> | null> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      return null;
    }
    const serverAddress =
      process.env.NEXT_PUBLIC_WEB_ENV === 'prod'
        ? process.env.NEXT_PUBLIC_PROD_CLOUD_FUNCTIONS
        : process.env.NEXT_PUBLIC_DEV_CLOUD_FUNCTIONS;
    const statsGet = axios.create({
      baseURL: serverAddress,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const response = await statsGet.get(url, {
      params,
    });

    return response.data;
  } catch (e) {
    return null;
  }
};

export const axiosPost = async (url: string, body: unknown): Promise<AxiosResponse<any, any> | null> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      return null;
    }
    const serverAddress =
      process.env.NEXT_PUBLIC_WEB_ENV === 'prod'
        ? process.env.NEXT_PUBLIC_PROD_CLOUD_FUNCTIONS
        : process.env.NEXT_PUBLIC_DEV_CLOUD_FUNCTIONS;
    const postReq = axios.create({
      baseURL: serverAddress,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });

    const response = await postReq.post(url, body);

    return response.data;
  } catch (e) {
    return null;
  }
};

export const axiosPatch = async (url: string, body: unknown): Promise<AxiosResponse<any, any> | null> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      return null;
    }
    const serverAddress =
      process.env.NEXT_PUBLIC_WEB_ENV === 'prod'
        ? process.env.NEXT_PUBLIC_PROD_CLOUD_FUNCTIONS
        : process.env.NEXT_PUBLIC_DEV_CLOUD_FUNCTIONS;
    const postReq = axios.create({
      baseURL: serverAddress,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const response = await postReq.patch(url, body);

    return response.data;
  } catch (e) {
    return null;
  }
};

export const axiosDelete = async (url: string, params: unknown): Promise<AxiosResponse<any, any> | null> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      return null;
    }
    const serverAddress =
      process.env.NEXT_PUBLIC_WEB_ENV === 'prod'
        ? process.env.NEXT_PUBLIC_PROD_CLOUD_FUNCTIONS
        : process.env.NEXT_PUBLIC_DEV_CLOUD_FUNCTIONS;
    const statsGet = axios.create({
      baseURL: serverAddress,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const response = await statsGet.delete(url, {
      params,
    });

    return response.data;
  } catch (e) {
    return null;
  }
};

// export const axiosPostRequest = async (
//   url: string,
//   params: unknown,
// ): Promise<AxiosResponse | null> => {
//   try {
//     const token = await auth.currentUser?.getIdToken();
//     if (!token) {
//       return null;
//     }
//     const serverAddress =
//       process.env.NEXT_PUBLIC_WEB_ENV === 'prod'
//         ? process.env.NEXT_PUBLIC_PROD_CLOUD_FUNCTIONS
//         : process.env.NEXT_PUBLIC_DEV_CLOUD_FUNCTIONS;

//     const instance = axios.create({
//       baseURL: serverAddress,
//       headers: {
//         'Content-Type': 'application/json',
//         authorization: `Bearer ${token}`,
//       },
//     });
//     const response = await instance.post(url, params);
//     return response.data;
//   } catch (error) {
//     return null;
//   }
// };
