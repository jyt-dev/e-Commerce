import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js"
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";


const updateAccountDetails = asyncHandler(async(req,res) => {

    const {fullName, email, username} = req.body;

    if(!fullName && !email && !username){
        throw new ApiError(400, "Atleast one field is required");
    }

    const updateFields = {};

    if(fullName) updateFields.fullName = fullName;
    if(email) updateFields.email = email;
    if(username) updateFields.username = username;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateFields
        },
        {
            new: true
        }
    )

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const updatedUser = await User.findById(req.user._id).select("-password -refreshToken");
    return res
             .status(201)
             .json(
                new ApiResponse(201,{updatedUser},"User account updated successfully")
            );
})

const updatePassword = asyncHandler(async(req,res) => {

    const {newPass,oldPass} = req.body;

    if(!newPass || !oldPass){
        throw new ApiError(401,"Enter password in password fields");
    }
    //get user from db 
    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(401,"User not available");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPass);

    if(!isPasswordValid){
        throw new ApiError(401,"Enter valid old password");
    }

    user.password = newPass;
    await user.save({validateBeforeSave: false});

    return res
             .status(201)
             .json(new ApiResponse(201,{},"Password updated successfully"));
})

const getCurrentUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(400,"User not found");
    }

    return res
             .status(201)
             .json(new ApiResponse(201,{user},"User fetched successfully"));
})

const becomeSeller = asyncHandler(async(req,res) => {
    const seller = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                role: "SELLER"
            },
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    return res
             .status(201)
             .json(new ApiResponse(201,seller,"Role updated successfully"));
})
export {
    updateAccountDetails,
    updatePassword,
    getCurrentUser,
    becomeSeller
}