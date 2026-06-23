import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    house: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        required: true
    },
    isDefault: {
        type: Boolean,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
},{timestamps: true})

export const Address = mongoose.model('Address',addressSchema);