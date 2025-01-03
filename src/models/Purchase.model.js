import mongoose, {Schema} from "mongoose";
import {PAID_ENUM} from "../constants.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const purchaseSchema = new Schema({
    purchaseDetails: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: ""
    },
    totalAmount:{
        type:Number,
        required:true,
        default:0,
        min:0
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    purchaseDate: {
        type: Date,
        required: true,
    },
    paid: {
        type: Number,
        required: true,
        enum: PAID_ENUM,
        index: true
    },
    createdBy: {
        type: String,
        required: true
    },
    modifiedBy: {
        type: String,
        required: true,
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
}, {timestamps: true});
purchaseSchema.plugin(mongooseAggregatePaginate)

export const Purchase = mongoose.model("Purchase", purchaseSchema);