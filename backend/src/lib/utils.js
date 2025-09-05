import jwt from "jsonwebtoken"


// to generate token we need a env variable 
export const generateToken = (userId,res) => {

    const token= jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",//basically after 7 days the token expires and user have to login again
    }
    )

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true ,// prevent XSS attacks cross-site scripting attacks and it is not accessible using javascript 
        sameSite:"strict",// CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "developement"  // in https, s stands for secure in production its https but as we are developing we dont need it to be true
    })

    return token;
};