import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js"
import {Product} from "../models/product.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ProductImage } from "../models/productImage.model.js";
import mongoose from "mongoose";
import escapeRegex from "../utils/escapeRegex.js";


const addProduct = asyncHandler(async(req, res) => {

    const user = req.user;
    if(user.role != "SELLER"){
        throw new ApiError(400, "Seller doesn't exist");
    }

    const {name, description, price, stock, category} = req.body;

    const requiredFields = {name, description, price, stock, category};

    for (const [key, value] of Object.entries(requiredFields)) {
        // Checks if the field is missing, null, or contains only blank spaces
        if (value === undefined || value === null || String(value).trim() === "") {
            throw new ApiError(400, `The ${key} field is required and cannot be empty`);
        }
    }

    const imageFiles = req.files; //stores and fetch images from user in a array
    if (!imageFiles || imageFiles.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }

    const product = await Product.create({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category: category.trim(),
        sellerId: user._id
    })

    if(!product){
        throw new ApiError(500, "Product field creation failed");
    }
    

    const imageUploadPromises = imageFiles.map(async (file) => {
        const uploadedImg = await uploadOnCloudinary(file.path); //upload image file one by one
        if (!uploadedImg?.url) {
            throw new ApiError(500, "Failed to upload image");
        }
        return ProductImage.create({
            productId: product._id,
            imageUrl: uploadedImg.url,
        });
    });

    // Fire all promises simultaneously and wait for all to complete
    const savedProductImages = await Promise.all(imageUploadPromises);

    await product.populate("sellerId", "fullName");

    return res
            .status(201)
            .json(new ApiResponse(201, {product, images: savedProductImages}, "Product added successfully"));
})

const getProductsBySeller = asyncHandler(async(req, res) => {

    const user = req.user;
    const sellerId = req.user._id;

    if(user.role != "SELLER"){
        throw new ApiError(400, "Seller doesn't exist")
    }

    const products = await Product.aggregate([
        {
            $match: {
                sellerId: new mongoose.Types.ObjectId(sellerId)
            }
        },
        {
            $lookup: {
                from: "productimages",
                localField: "_id",
                foreignField: "productId",
                as: "images"
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                category: 1,
                price: 1,
                stock: 1,
                createdAt: 1,
                images: {
                    $map: {
                        input: "$images",
                        as: "img",
                        in: "$$img.imageUrl"
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res
            .status(200)
            .json(new ApiResponse(200, products, "Products by seller fetched successfully"))


})

const getProducts = asyncHandler(async (req, res) => {

    const {
        page = 1,
        limit = 30,
        category,
        query = "",
        sortBy = "createdAt",
        sortType = "asc"
    } = req.query;

    const allowedSortField = [
        "createdAt",
        "price",
        "rating",
        "stock",
        "category"
    ];

    const sortField = allowedSortField.includes(sortBy)
        ? sortBy
        : "createdAt";

    const pipeline = [];

    // --- Search stage: only added if there's an actual query ---
    if (query && query.trim()) {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length > 100) {
            throw new ApiError(400, "Search query too long");
        }

        const searchStage = {
            $search: {
                index: "atlasSearchProducts",
                compound: {
                    should: [
                        {
                            text: {
                                query: trimmedQuery,
                                path: "name",
                                score: { boost: { value: 3 } } // name matches rank higher
                            }
                        },
                        {
                            autocomplete: {
                                query: trimmedQuery,
                                path: "name",
                                score: { boost: { value: 2 } }
                            }
                        },
                        {
                            text: {
                                query: trimmedQuery,
                                path: "description"
                            }
                        }
                    ],
                    minimumShouldMatch: 1
                }
            }
        };

        pipeline.push(searchStage);

        // capture relevance score before later stages drop it
        pipeline.push({
            $addFields: { searchScore: { $meta: "searchScore" } }
        });
    }

    // --- Category filter (exact match, safe) ---
    if (category && typeof category === "string") {
        pipeline.push({
            $match: { category: category }
        });
    }

    // --- Existing lookups, unchanged ---
    pipeline.push(
        {
            $lookup: {
                from: "productimages",
                localField: "_id",
                foreignField: "productId",
                as: "images"
            }
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "productId",
                as: "reviews"
            }
        },
        {
            $addFields: {
                rating: {
                    $ifNull: [{ $avg: "$reviews.rating" }, 0]
                },
                reviewCount: { $size: "$reviews" }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                category: 1,
                price: 1,
                stock: 1,
                rating: { $round: ["$rating", 1] },
                reviewCount: 1,
                searchScore: 1,
                images: {
                    $map: {
                        input: "$images",
                        as: "img",
                        in: "$$img.imageUrl"
                    }
                }
            }
        }
    );

    // --- Sort: relevance if searching, otherwise the requested field ---
    if (query && query.trim()) {
        pipeline.push({ $sort: { searchScore: -1 } });
    } else {
        pipeline.push({
            $sort: { [sortField]: sortType === "asc" ? 1 : -1 }
        });
    }

    const aggregate = Product.aggregate(pipeline);

    const options = {
        page: Math.max(Number(page) || 1, 1),
        limit: Math.min(Math.max(Number(limit) || 30, 1), 100)
    };

    const products = await Product.aggregatePaginate(aggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const getProductById = asyncHandler(async(req, res) => {
    const {productId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(400, "Invalid Product ID");
    }

    const product = await Product.findById(productId).populate("sellerId", "name");

    const images = await ProductImage.find({productId});

    return res
            .status(200)
            .json(new ApiResponse(200, {product, images}, "Product Details fetched successfully"))
})

const deleteProduct = asyncHandler(async(req, res) => {

    if(req.user.role != "SELLER"){
        throw new ApiError(400, "Seller doesn't exist")
    }

    const {productId} = req.params

    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(400, "Invalid ProductId")
    }

    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(404, "Product not found");
    }

    if(product.sellerId.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized request");
    }

    // Output -> [{img1.jpeg}, {img2.jpeg}, ....]
    const images = await ProductImage.aggregate([
       {
            $match: {
                productId: new mongoose.Types.ObjectId(productId)
            }
       },
       {
            $project: {
                _id: 1,
                imageUrl: 1
            }
       }
    ])

    const urls = images.map((img) => img.imageUrl); //converted to array of object url to simply array of urls
    // const imgsId = images.map((img) => img._id);

    
    await Promise.allSettled(
        urls.map(async(url) => {
            const deletedImgCloudinary = await deleteFromCloudinary(url);
            if (!deletedImgCloudinary) {
                throw new ApiError(400, "Image deletion from Cloudinary failed")
            }
        })
    )

    // await Promise.all(
    //     imgsId.map(async(imgId) => {
    //         const deleteImgDB = await ProductImage.findByIdAndDelete(imgId);
    //         if(!deleteImgDB){
    //             throw new ApiError(400, "Image deletion from DB failed")
    //         }
    //     })
    // )

    await ProductImage.deleteMany({productId}); //more efficient

    await Product.findByIdAndDelete(productId);
    return res
            .status(200)
            .json(new ApiResponse(200, {}, "Product Deleted Successfully"));
})

export {
    addProduct,
    getProductsBySeller,
    getProducts,
    deleteProduct,
    getProductById
}