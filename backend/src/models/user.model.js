import mongoose from "mongoose";

// data base has two models one with user info and other msg info 
// this Schema creates a model with the required fields 
const userSchema =new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            type :String,
            required:true,
        },
        password:{
            type :String,
            required:true,
        },
        profilePic:{
            type:String,
            default :"",
        },
    },
    //timestamps give createdAt and updatedAt , to show in profile member since....
    {timestamps:true}
);

//mongoose.model creates the model always use singular and first letter uppercase like User and not users
const User=mongoose.model("User",userSchema);

export default User;