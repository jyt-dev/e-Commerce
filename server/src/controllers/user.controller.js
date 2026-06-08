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

    const decodedToken = await jwt.verify(
        incomingRefresToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(401, "Invalid refresh Token");
    }

    if(incomingRefresToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh Token expired or used");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

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

const updateUser = asyncHandler(async(req,res) => {

    const {fullName, email, username, password} = req.body;
    await User.findByIdAndUpdate(
        req.user._id,
        {
            email: email,
            fullName: fullName,
            username: username,

        },
        {
            new: true,
            runValidators: true
        }
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    refreshAccessToken
}