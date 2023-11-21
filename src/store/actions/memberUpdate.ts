// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Typage local
type UpdateMemberI = {
  id: number | null;
  objData: FormData;
};

//* Update un membre
const updateMember = createAsyncThunk(
  'user/updateMember',
  async ({ id, objData }: UpdateMemberI) => {
    try {
      const { data } = await axiosInstance.put(`/api/users/${id}`, objData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // ? On retourne le state

      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

export default updateMember;
