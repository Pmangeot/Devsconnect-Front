// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

//* Ajouter un membre à un projet
const ProjectDeleteMember = createAsyncThunk(
  'project/ProjectDeleteMember',
  async ({ projectId, userId }) => {
    try {
      await axiosInstance.delete(`/api/projects/${projectId}/user/${userId}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export default ProjectDeleteMember;
