import { user } from "./user.js";

export const issueToken = (userId) => {
  if (!userId) {
    throw new Error("No userid");
  }
  return { token: `${userId}_${new Date().toISOString()}` };
};

export const requestToken = (credentials) => {
  return issueToken(user(credentials)?.userId);
};
