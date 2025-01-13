import axios from '~/services/axiosConfig';
export const get = async () => {
    try {
      const {data} = await axios.get(`api/meetup`);
  
      return await data;
    } catch (error) {
      throw error;
    }
  };