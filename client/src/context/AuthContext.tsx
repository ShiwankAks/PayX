import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../api/authService";


type User= {
    id:number,
    username:string,
    phone:string,
    email:string
}

type AuthContextType = {
  user: User | undefined;
};



 const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider =({children}: {children:React.ReactNode})=>{
    const [user, setUser] = useState<User>()
      const getUser = async()=>{
        try {
          const res = await authService.currentUser()
          console.log(res.data.safeUser)
          setUser(res.data.safeUser)
        } catch (error) {
          console.log("Cannot fetch user")
        }
      }
    
      useEffect(()=>{
        getUser()
      },[])

      return(
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
      )
     }

     export const useAuth=()=>{
        const context = useContext(AuthContext)
        if (!context) {
            throw new Error("useAuth must be used within AuthProvider")
        }
        return context
     }