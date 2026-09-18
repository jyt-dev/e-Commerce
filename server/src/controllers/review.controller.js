import mongoose from "mongoose";
import { Review } from "../models/review.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";


const giveReview = asyncHandler(async (req, res) => {

    const reviewer = req.user._id;

    const {
        productId,
        rating,
        comment = ""
    } = req.body;

    // Validate productId
    if (!productId) {
        throw new ApiError(400, "ProductId can't be blank");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid ProductId");
    }

    // Validate rating
    if (rating === undefined || rating === null || rating === "") {
        throw new ApiError(400, "Rating can't be blank");
    }

    const ratingNum = Number(rating);

    if (
        !Number.isInteger(ratingNum) ||
        ratingNum < 1 ||
        ratingNum > 5
    ) {
        throw new ApiError(
            400,
            "Rating should be an integer between 1 and 5"
        );
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
        reviewer,
        productId
    });

    if (existingReview) {
        throw new ApiError(
            409,
            "You have already reviewed this product"
        );
    }

    const productReview = await Review.create({
        reviewer,
        productId,
        rating: ratingNum,
        comment
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                productReview,
                "Product review created successfully"
            )
        );
});

const getAllReviews = asyncHandler(async (req, res) => {
    const reviewer = req.user._id;

    const reviews = await Review.find({
        reviewer
    })
    .populate("productId", "name price")
    .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                reviews,
                "Reviews fetched successfully"
            )
        );
})

const getReview = asyncHandler(async (req, res) => {
    const reviewer = req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid ProductId");
    }

    const review = await Review.findOne({
        reviewer,
        productId
    }).populate("productId", "name price");

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                review,
                "Review fetched successfully"
            )
        );
});