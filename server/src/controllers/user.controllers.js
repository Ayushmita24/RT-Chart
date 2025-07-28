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

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }
  // Validate userID
  const existingId = await User.findOne({ userid });
  if (existingId) {
    throw new ApiError("User ID already exists", 400);
  }
  // Create a new user
  const user = await User.create({ fname, lname, userid, email, password });
  const userCreated = await User.findById(user._id).select("-password");
  if (!userCreated) {
    throw new ApiError("User creation failed", 500);
  }
  console.log("User created successfully:", userCreated);
  return res
    .status(201)
    .json(new ApiResponse(201, userCreated, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { emailOrId, password } = req.body;

  if (!emailOrId || !password) {
    throw new ApiError("Email/ID and password are required", 400);
  }

  const user = await User.findOne({
    $or: [{ email: emailOrId }, { userid: emailOrId }],
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError("Invalid credentials", 401);
  }

  const userResponse = await User.findById(user._id).select("-password");
  console.log("User logged in successfully:", userResponse);
  return res
    .status(200)
    .json(new ApiResponse(200, userResponse, "Login successful"));
});
