import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `mongodb+srv://rohansamanta45:imxrohan23@cluster0.d30b52f.mongodb.net/rt-chat`,
    );
    console.log(
      "MongoDB connected successfully:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with failure
  }
};
export { connectDB };