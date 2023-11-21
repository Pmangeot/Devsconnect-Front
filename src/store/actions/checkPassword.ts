// actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? instance Axios
import axiosInstance from '../../utils/axios';

const checkPassword = createAsyncThunk(
  'ajax/checkPassword',
  async (oldPassword, id) => {
    try {
      const { data } = await axiosInstance.post(
        '/api/users/checkPassword',
        oldPassword,
        id
      );
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);
export default checkPassword;
