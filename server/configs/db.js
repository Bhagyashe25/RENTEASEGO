import mongoose from "mongoose";

const connectDB = async ()=>{

    try {
       console.log("🔗 Connecting to MongoDB...");
    console.log("📍 URI:", process.env.MONGODB_URI); // ✅ Debug log

    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected");
      console.log("📁 Database:", mongoose.connection.name);
    });

    // ✅ Use MONGODB_URI
    await mongoose.connect(`${process.env.MONGODB_URI}/rental-app`);

    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;