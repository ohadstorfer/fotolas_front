// photographerAPI.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const token = localStorage.getItem('token');

export function PhotographerByUserId(userId: number, token: string) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/photographer/by_user/${userId}/`;
  return axios.get(MY_SERVER, {
    headers: {
      'Authorization': `Bearer ${token}`,  // Include the JWT token in the Authorization header
    },
  });
}


// Renamed function to avoid conflict
export const refreshTokenAPI = async (refreshToken: string) => {
  const response = await axios.post('https://9km-curious-mach.circumeo-apps.net/refresh/', {
    refresh: refreshToken
  });
  return response.data;
};
