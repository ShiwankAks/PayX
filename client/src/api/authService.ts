import { apiClient } from "./apiClient";

export const authService = {
  signup: async (
    email: string,
    password: string,
    username: string,
    phone: string,
  ) => {
    const response = await apiClient.post("/auth/signup", {
      email,
      password,
      username,
      phone,
    });
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response;
  },

  currentUser: async()=>{
    const response = await apiClient.get("/auth/user")
    return response
  }
};
