import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";
import { uploadFile } from "../services/stroage.service.js";

//token generation and sending response
async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,{
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            role: user.role
        }
    })

}   

//register a new user
export const register = async (req, res) =>{
    const {password, fullName} = req.body;
    const email = req.body.email.trim().toLowerCase();
    try{
        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.status(400).json({message: "User with this email or contact already exists"});
        }

        const user = await userModel.create({
            email,
            password,
            fullName,
        })

        await sendTokenResponse(user, res, "User registered successfully");

    } catch(error){
        console.error("Error during user registration:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

//login a user
export const login = async (req, res) =>{
    const {password} = req.body;
    const email = req.body.email.trim().toLowerCase();

    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid  password"});
        }

        await sendTokenResponse(user, res, "User logged in successfully");

    } catch(error){
        console.error("Error during user login:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

//google callback
export const googleCallback = async (req, res) => {
    try {
        const { id, emails, displayName, photos } = req.user || {};
        const email = emails?.[0]?.value?.trim().toLowerCase();
        const profilePicture = photos?.[0]?.value || null;

        if (!email) {
            return res.redirect(`${config.FRONTEND_URL}/login?error=no_email_from_google`);
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                email,
                googleId: id,
                fullName: displayName || "User",
                profilePicture,
            });
        } else if (!user.googleId) {
            user.googleId = id;
            if (!user.profilePicture && profilePicture) {
                user.profilePicture = profilePicture;
            }
            await user.save();
        }

        const token = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(config.FRONTEND_URL);
    } catch (error) {
        console.error("Google callback error:", error);
        res.redirect(`${config.FRONTEND_URL}/login?error=google_login_failed`);
    }
}

//get user details
export const getMe = async (req, res) =>{

    const user = req.user

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            role: user.role
        }
    })

}

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "Logged out successfully", success: true });
}


// update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, newPassword, currentPassword } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update full name
    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    // Update profile picture
    if (req.file) {
      const uploadedFile = await uploadFile({
        buffer: req.file.buffer,
        fileName: req.file.originalname,
      });

      user.profilePicture = uploadedFile.url;
    }

    // Set / change password
    if (newPassword !== undefined) {
      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long",
          success: false,
        });
      }

      // Password users must confirm their current password
      if (user.password) {
        if (!currentPassword) {
          return res.status(400).json({
            message: "Current password is required",
            success: false,
          });
        }

        const isPasswordCorrect =
          await user.comparePassword(currentPassword);

        if (!isPasswordCorrect) {
          return res.status(401).json({
            message: "Current password is incorrect",
            success: false,
          });
        }
      }

      // user.model.js pre-save hook should hash this before storage
      user.password = newPassword;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return res.status(500).json({
      message: "Unable to update profile",
      success: false,
    });
  }
};
