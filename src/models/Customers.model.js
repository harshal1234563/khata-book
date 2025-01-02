import mongoose, {Schema} from "mongoose";

const customerSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
            index: true
        },
        phone: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        },
        modifyBy: {
            type: String,
            required: true,
            default: ""
        },
        createdBy: {
            type: String,
            required: true
        },
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },
        purchaseHistory: {
            type: Schema.Types.ObjectId,
            ref: "Purchase"
        },
        paymentHistory: {
            type: Schema.Types.ObjectId,
            ref: "Payment"
        }
    },
    {timestamps: true});

export const Customer = mongoose.model("Customer", customerSchema);