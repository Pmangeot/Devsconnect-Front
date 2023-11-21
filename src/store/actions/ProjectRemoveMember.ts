// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

//* Retrait un membre à un projet
const ProjectRemoveMember = createAsyncThunk(
  'project/Project_removeMember',
  async ({ projectId, userId }) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/projects/${projectId}/user/${userId}`
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export default ProjectRemoveMember;
