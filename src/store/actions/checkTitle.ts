// actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? instance Axios
import axiosInstance from '../../utils/axios';

const checkTitle = createAsyncThunk('ajax/checkTitle', async (oldTitle) => {
  try {
    const { data } = await axiosInstance.post(
      '/api/projects/checkTitle',
      oldTitle
    );
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
});
export default checkTitle;
