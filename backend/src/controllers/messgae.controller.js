import cloudinary from "../lib/cloudinary.js";
import Messgae from "../models/message.model.js";



export const getUsersForSidebar =async (req,res)=>{

    try {
        const loggedInUserId=req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUserForSidebar",error.message);
        res.status(500).json({message:"Internal server error"})
    }


};

export const getMessages=async (req,res)=>{
    try {

        //req.params is basically gives a string but req.body gives a JSON file 
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        const messages=await Messgae.find({
            $or:[
                {sendemyId:myId ,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const myId=req.user._id;

        let imageUrl;

        if(image){
            //upload base64 image to cloudinary
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })

        await newMessage.save();
         
        //todo:realtime functionaity goes here =>socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}
