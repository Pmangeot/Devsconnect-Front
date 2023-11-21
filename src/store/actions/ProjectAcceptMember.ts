// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Interface
interface PropsI {
  projectId: number;
  userId: number;
}

//* Ajouter un membre à un projet
const ProjectAcceptMember = createAsyncThunk(
  'project/ProjectAcceptMember',
  async ({ projectId, userId }: PropsI) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/projects/${projectId}/user/${userId}`
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export default ProjectAcceptMember;
