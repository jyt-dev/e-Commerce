import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    price: {
        type: Number,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
    },
    stock: {
        type: Number,
        required: true
    }
},{timestamps: true})

export const Product = mongoose.model('Product', productSchema);