// ? Librairie
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? instance Axios
import axiosInstance from '../../utils/axios';

//* Supprimer un membre
const deleteMember = createAsyncThunk(
  'user/deleteMember',
  async (id: string) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      // ? On retourne le state
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

export default deleteMember;
