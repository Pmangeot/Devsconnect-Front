// actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? instance Axios
import axiosInstance from '../../utils/axios';

const checkPseudo = createAsyncThunk('ajax/checkPseudo', async (oldPseudo) => {
  try {
    const { data } = await axiosInstance.post(
      '/api/users/checkPseudo',
      oldPseudo
    );
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
});
export default checkPseudo;
