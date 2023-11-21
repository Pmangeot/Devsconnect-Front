// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Typage local
type UpdateProjectI = {
  id: number | null;
  objData: {
    // Propriétés sérialisables nécessaires
    availability: boolean;
    tags: string[];
    title?: string;
    description?: string;
  };
};

//* Update un projet
const updateProject = createAsyncThunk(
  'project/projectUpdate',
  async ({ id, objData }: UpdateProjectI) => {
    try {
      const data = await axiosInstance.put(`/api/projects/${id}`, objData);

      // ? On retourne le state
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

export default updateProject;
