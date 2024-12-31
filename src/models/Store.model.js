import mongoose, {Schema} from "mongoose";

const storeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Store name is required"],
            unique: true,
            trim: true,
            index: true
        },
        address: {
            type: String,
            required: [true, "Store address is required"],
            trim: true,
            lowercase: true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref: "User",
            required:true,
            index: true
        },
        isDeleted:{
            type:Boolean,
            default:false
        }
    },
    {timestamps: true});


export const Store = mongoose.model("Store", storeSchema);