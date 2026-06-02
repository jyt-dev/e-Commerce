import mongoose from "mongoose";
import 'dotenv/config';
import { DB_NAME } from "../constants.js";

import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

//dB connection function

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DB connection esatblished !! DB Host : ${connectionInstance.connection.host}`);
    }
    catch(err){
        console.log("DB connection FAILED!!",err);
        process.exit(1);
    }
}

export {connectDB};

//same as above

// async function connectDB() {
//     const result = await mongoose.connect(url);
// }