import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // sender: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // receiver: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 1 * 60 * 1000), // Default to 1 minute from now
    },
  },
  { timestamps: true }
);

messageSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const Message = mongoose.model("Message", messageSchema);
