import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../api/authService";
import type { User } from "../types/types";




type AuthContextType = {
  user: User | undefined;
  loading : boolean
  getUser:()=>Promise<void>
};


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>()
  const [loading , setLoading] = useState(true)
  const getUser = async () => {
    try {
      const res = await authService.currentUser()
      // console.log(res.data.safeUser)
      setUser(res.data.safeUser)
    } catch (error) {
      console.log("Cannot fetch user")
      localStorage.removeItem("token")
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, getUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}