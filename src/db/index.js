import mongoose from "mongoose";
import {DB_NAME} from "../constamts.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (e) {
        console.log('ERROR occurred while connecting the database !! ', e);
        process.exit(1);
    }
}

export default connectDB;