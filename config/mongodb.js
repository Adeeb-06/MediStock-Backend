import mongoose from "mongoose";
const connectMongoDb = async () => {
    try {
        let res = await mongoose.connect(process.env.MONGODB_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        if (res) {
            console.log("MongoDB connected");
        }
    } catch (error) {
        console.log('mongoDB connection error', error);
    }
}

export default connectMongoDb;