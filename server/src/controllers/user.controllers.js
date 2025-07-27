import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, userid, email, password } = req.body;

  if ([fname, lname, userid, email, password].some((field) => !field)) {
    throw new ApiError("All fields are required", 400);
  }
  if (password.length < 3) {
    throw new ApiError("Password must be at least 3 characters long", 400);
  }
  // future add-on quality of life changes[email verification, password strength, etc.]
  // Validate userID
  const existingId = await User.findOne({ userid });
  if (existingId) {
    throw new ApiError("User ID already exists", 400);
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  // Create a new user
  const user = await User.create({ fname, lname, userid, email, password });
  const userCreated = await User.findById(user._id).select("-password");
  if (!userCreated) {
    throw new ApiError("User creation failed", 500);
  }
  return res
    .status(201)
    .json(new ApiResponse(201, userCreated, "User registered successfully"));
});
