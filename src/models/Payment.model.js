import mongoose, {Schema} from "mongoose";

const paymentSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: String,
        required: true
    },
    modifiedBy: {
        type: String,
        required: true
    },
}, {timestamps: true});

export const Payment = mongoose.model("Payment", paymentSchema);