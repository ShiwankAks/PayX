import { useAuth } from "../context/AuthContext";

export const useRequiredAuth = () => {
    const auth = useAuth()


  if (!auth.user && !auth.loading) {
    throw new Error("User must be authenticated");
  }
  return { 
    ...auth,
    user: auth.user!
   };
};
