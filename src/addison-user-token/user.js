export const user = (credentials) => {
  const { username, password } = credentials;
  if (!username) {
    throw new Error("No username");
  }

  if (!password) {
    throw new Error("No password");
  }

  if (username[0] === "A") {
    throw new Error("Invalid username");
  }

  if (username.toUpperCase() !== password) {
    throw new Error("Invalid password");
  }

  return { userId: username };
};
