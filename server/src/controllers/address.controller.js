import mongoose from "mongoose";
import { Address } from "../models/address.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addAddress = asyncHandler(async(req, res) => {
    const {house,landmark,city,state,country,pin,phone,isDefault = false} = req.body;

    const requiredFields = { house, landmark, city, state, country, pin, phone };

    // 2. Loop through and safely check each field
    for (const [key, value] of Object.entries(requiredFields)) {
        // Checks if the field is missing, null, or contains only blank spaces
        if (value === undefined || value === null || String(value).trim() === "") {
            throw new ApiError(400, `The ${key} field is required and cannot be empty`);
        }
    }
    
    const existingAddressCount = await Address.countDocuments({ userId: req.user._id });

    //first address or only one address will be the default
    if (existingAddressCount === 0) {
        isDefault = true;
    }

    if(existingAddressCount >= 5){
        throw new ApiError(400, "You can't add more than 5 addresses, delete old ones first");
    }

    // Update any other default address to false 
    if(isDefault){
        await Address.updateMany(
            {userId: req.user._id},
            {$set: {isDefault: false}}
        )
    }
    const address = await Address.create({
        userId: req.user._id,
        house: house.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        state: state.trim(),
        pin: pin.trim(),
        country: country.trim(),
        phone: phone.trim(),
        isDefault
    });

    if(!address){
        throw new ApiError(500, "Address field creation failed");
    }

    return res
             .status(201)
             .json(new ApiResponse(201,address,"Address added successfully"));
})
const getAddressbyId = asyncHandler(async(req, res) => {
    const {addressId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400, "Invalid addressId");
    }

    const address = await Address.findById(addressId).populate(
        "userId", "fullName"
    );

    if(!address){
        throw new ApiError(404, "Address not avilable");
    }

    return res
            .status(200)
            .json(new ApiResponse(200, address, "Addresses fetched successfully"))
})
const deleteAddress = asyncHandler(async(req, res) => {
    const {addressId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400, "Invalid addressId");
    }

    const address = await Address.findOne({
        _id: addressId,
        userId: req.user._id
    });

    if(!address){
        throw new ApiError(404, "Address not found");
    }

    if(address.isDefault){
            throw new ApiError(400, "Default address can't be deleted");
    }

    await Address.deleteOne();

    return res
             .status(200)
             .json(new ApiResponse(200, {}, "Address deleted successfully"))
})
const updateAddress = asyncHandler(async(req, res) => {
    const {addressId} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400, "Invalid address Id");
    }

    const currentAddress = await Address.findById(addressId);

    if(!currentAddress){
        throw new ApiError(404, "Address not found");
    }

    if(currentAddress.userId.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized request");
    }

    const {house,landmark,city,state,country,pin,phone,isDefault} = req.body;

    const fields = [house, landmark, city, state, country, pin, phone];
    const hasAtLeastOneField = fields.some(field => {
        if (field === undefined || field === null) return false;
        return String(field).trim() !== "";
    });

    if (!hasAtLeastOneField) {
        throw new ApiError(400, "At least one address field is required");
    }

    const updateFields = {};

    if(house !== undefined && house !== null) updateFields.house = house.trim();
    if(landmark !== undefined && landmark !== null) updateFields.landmark = landmark.trim();
    if(city !== undefined && city !== null) updateFields.city = city.trim();
    if(state !== undefined && state !== null) updateFields.state = state;
    if(phone !== undefined && phone !== null) updateFields.phone = phone.trim()
    if(country !== undefined && country !== null) updateFields.country = country.trim();
    if(pin !== undefined && pin !== null) updateFields.pin = pin.trim();

    if(isDefault === true){
        await Address.updateMany(
            {userId: req.user._id},
            {$set: {isDefault: false}}
        )
        updateFields.isDefault = isDefault;
    }

    const address = await Address.findByIdAndUpdate(
        addressId,
        {
            $set: updateFields
        },
        {
            new: true
        }
    ).populate("userId", "fullName");

    return res
             .status(200)
             .json(new ApiResponse(200, address, "Address updated successfully"));
})
const getAllAddresses = asyncHandler(async(req, res) => {
    const {page = 1, limit = 5, sortBy = "createdAt", sortType = "desc"} = req.query;

    const targetUserId = req.user?._id;

    const aggregate = Address.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(targetUserId)
            }
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
                pipeline: [
                    {
                        $project: {
                            fullName: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: $userId
        },
        {
            $project: {
                house: 1,
                landmark: 1,
                city: 1,
                state: 1,
                country: 1,
                pin: 1,
                phone: 1,
                isDefault: 1,
                createdAt: 1,
                user: "$userDetails" // Maps the unwound full name object safely to a clean "user" key
            }
        }
    ])

    const options = {
        page: Number(page), //Number convert String to Integer 
        limit: Number(limit)
    };

    const addresses = await Address.aggregatePaginate(
        aggregate,
        options
    )

    return res
            .status(200)
            .json(new ApiResponse(200,addresses,"Addresses fetched successfully"));

})

export {
    addAddress,
    updateAddress,
    deleteAddress,
    getAddressbyId,
    getAllAddresses
}