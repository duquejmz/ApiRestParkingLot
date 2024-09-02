// import mongoose from "mongoose";
import { connect } from 'mongoose' 

export async function dbConnect() {
    try {
        await connect(process.env.MONGO_CONNECTION)
        console.log('Connect to server database');
    } catch (error) {
        console.log(error);
    }
}

export default dbConnect