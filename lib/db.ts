import mongoose from "mongoose";

//nextjs runs on edge runtime 
let isConnected = false;

export default async function connectDb(){

    if(isConnected){
        console.log("MOngoDb already connected");
        return
    }

    try{
        const db = await mongoose.connect(`${process.env.MONGODB_URL}`);
        isConnected = db.connections[0].readyState === 1
        console.log("Database connected");
    }catch(error){
        console.error("Database error :", error);
        throw error;
    }
}