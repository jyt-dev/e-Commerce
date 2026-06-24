import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
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
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
},{timestamps: true})

addressSchema.plugin(mongooseAggregatePaginate);

export const Address = mongoose.model('Address',addressSchema);