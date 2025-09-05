import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

// next will call the next function 
export const protectRoute=async(req,res,next)=>{
    try {
        
        const token=req.cookies.jwt;

    if(!token){
        return res.status(401).json({message:"Unauthorized no token provided"});
    }

    const decoded= jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded){
        return res.status(401).json({message:"Unauthorized token"});
    }
    
    const user= await User.findById(decoded.userId).select("-password");

    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    // after validating we are making requested user as the user who is trying to change the profile pic  or doing anything else 
    req.user=user

    next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};