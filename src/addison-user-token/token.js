import { user } from "./user.js";

export const issueToken = (user) => {
  if (!user) {
    throw new Error("No username");
  }
  return { token: `${user}_${new Date().toISOString()}` };
};

export const requestToken = (credentials) => {
  return issueToken(user(credentials)?.userId);
};
