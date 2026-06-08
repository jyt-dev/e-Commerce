import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js"
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async(req,res) => {
   
    const {fullName,username,password,email} = req.body;

    if([fullName,username,password,email].some((field) => field?.trim() == "")){
        throw new ApiError(400,"These fields are required");
    }

    const isUserExist = await User.findOne({
        $or: [{username: username},{email: email}]
    });

    if(isUserExist){
        throw new ApiError(400,"User alreday exists");
    }
    //create user in dB
    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        fullName,
        password,
    })

    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!userCreated){
        throw new ApiError(500, "Something went wrong on registring the user");
    }

    return res.status(201).json(
        new ApiResponse(201, userCreated, "User registered successfully"))
    
})

const loginUser = asyncHandler(async(req,res) => {

    const {username,password,email} = req.body;

    if(!(username || email) || !password){
        throw new ApiError(400, "username,password or email required");
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    });

    if(!user){
        throw new ApiError(400,"User doesn't exist register first");
    }
    //user used not User because method is created by you
    //User is used when mongoose method is applied
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, "Enter valid password");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
              .status(200)
              .cookie("accessToken", accessToken, options)
              .cookie("refreshToken", refreshToken, options)
              .json(new ApiResponse(
                200,
                {
                    userData : loggedInUser,
                    accessToken,
                    refreshToken
                },
                "user logged in succesfully"
              ));
})

const logoutUser = asyncHandler(async(req,res) => {
    //after verifyJWT middleware is executed it passes a user field

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
              .status(200)
              .clearCookie("accessToken",options)
              .clearCookie("refreshToken",options)
              .json(new ApiResponse(
                200,
                {},
                `${req.user.fullName} logged out successfully`
              ))

})

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefresToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefresToken){
        throw new ApiError(401, "Unauthorized request");
    }
    //payload from token
    const decodedToken = await jwt.verify(
        incomingRefresToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(401, "Invalid refresh Token");
    }
    //checks if client and stored refreshToken is same
    if(incomingRefresToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh Token expired or used");
    }
    //generates new accesToken
    const accessToken = await user.generateAccessToken();

    //generate refreshToken befory expiry because we use refreshToken
    //ROTATION principle that generates new refreshToken everytime when
    //accessToke is refreshed
    const refreshToken = await user.generateRefreshToken();

    //save new refreshtoken in db
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
             .status(201)
             .cookie("accessToken",accessToken,options)
             .cookie("refreshToken",refreshToken,options)
             .json(
                new ApiResponse(
                    201,
                    {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    },
                    "Access Token refreshed"
                )
            )


    
})

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
        throw new ApiError(401,"Password updation failded");
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
export {
    registerUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    refreshAccessToken,
    updatePassword,
    getCurrentUser
}