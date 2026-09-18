import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reviewSchema = new mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.index(
    { reviewer: 1, productId: 1 },
    { unique: true }
);

reviewSchema.plugin(mongooseAggregatePaginate)
export const Review = mongoose.model("Review", reviewSchema);