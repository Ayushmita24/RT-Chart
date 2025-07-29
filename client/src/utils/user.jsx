import { nanoid } from "nanoid";

// Store userId in localStorage so it persists
const getUser = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = nanoid(6);
    localStorage.setItem("userId", userId);
  }

  return {
    id: userId,
    name: "Anonymous", // You can later let users set this
  };
};

export default getUser;
