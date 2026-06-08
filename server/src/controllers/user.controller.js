import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js"
import {User} from "../models/user.model.js";


const registerUser = asyncHandler(async(req,res) => {
   
    const {email,username,password,fullName} = req.body();

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

    const userCreated = await User.findbyId(user._id).select(
        "-password -refreshToken"
    )

    if(!userCreated){
        throw new ApiError(500, "Something went wrong on registring the user");
    }

    return res.status(201).json(
        new ApiResponse(200, userCreated, "User registered successfully"))
    
})

const loginUser = asyncHandler(async(req,res) => {

    const {username,password,email} = req.body();

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
              .cookie("refreshToken, refreshToken, options")
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
                "User logged out successfully"
              ))

})

export {
    registerUser,
    loginUser,
    logoutUser
}