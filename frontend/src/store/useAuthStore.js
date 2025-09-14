import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import axios from "axios";

// creating a state for authorized user and using it in every page 
// we can use this useAuthStore anywhere and destructure it to know if the user is authorized or not 
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            //axios instance basically gives the base url before the /auth/check that is tha localhost:5001 part 
            // /auth/check endpoint verifies if the user is authenticated which is created in the backend 
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in useAuthStore", error.message);
            set({ authUser: null });

        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isLoggingIn:false});
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }

    },
    updateProfile:async(data)=>{

    }
}))