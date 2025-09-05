import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";

// creating a state for authorized user and using it in every page 
// we can use this useAuthStore anywhere and destructure it to know if the user is authorized or not 
export const useAuthStore= create((set)=>({
    authUser:null,
    isSigningIn:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,
    checkAuth:async()=>{
        try {
            //axios instance basically gives the base url before the /auth/check that is tha localhost:5001 part 
            // /auth/check endpoint verifies if the user is authenticated which is created in the backend 
            const res=await axiosInstance.get("/auth/check");

            set({authUser:res.data});
        } catch (error) {
            console.log("Error in useAuthStore",error.message);
            set({authUser:null});

        }finally{
            set({isCheckingAuth:false});
        }
    },
}))