// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

//* Ajouter un membre à un projet
const ProjectAddMember = createAsyncThunk(
  'project/Project_addMember',
  async ({ projectId, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/projects/${projectId}/user/${userId}`
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export default ProjectAddMember;
