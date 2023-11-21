// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

const signinUser = createAsyncThunk(
  'user/signinUser',
  async (objData: FormData) => {
    try {
      const { data } = await axiosInstance.post('/signin', objData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // ? On retourne le state
      return data;
    } catch (error) {
      console.error();
      error;

      throw error;
    }
  }
);

export default signinUser;
