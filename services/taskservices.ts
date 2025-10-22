import api from "@/lib/api";

export const getTasks = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/posts`, {
      params: { page, limit },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
