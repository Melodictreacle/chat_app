import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// inside signup , hash passowrd , create a user and create a token 
export const signup = async (req, res) => {
    // extracting the attributes from body 
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Fill all the fields!!!!" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        //user basically true or false depending on the presence of the email in the database 
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists." });
        }
        // salt is basically with which the password is mixed to make it hashed and not so easy to understand 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //creating a user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        // if created then generating JWT=JSON web token
        if (newUser) {
            //function for generating token in another file inside utils.js to make the codebase cleaner 
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        } else {
            res.status(400).json({ message: "Invalid User data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req);
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in login controller", error, message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        // delete cookies , jwt token
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully " });
    } catch (error) {
        console.log("Error in logout controller ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;

        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        //findOneAndUpdate gives back the user as it was before the update but if new:true is set it will return the update user
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url },{new:true});

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const checkAuth=async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}