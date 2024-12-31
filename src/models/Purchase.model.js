import mongoose, {Schema} from "mongoose";
import {PAID_ENUM} from "../constants.js";

const purchaseSchema = new Schema({
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
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
}, {timestamps: true});

export const Purchase = mongoose.model("Purchase", purchaseSchema);