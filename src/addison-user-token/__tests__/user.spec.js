import { user } from "../user.js";

describe("user module", () => {
  it("throws an error for empty user name", () => {
    expect(() => user({})).toThrow("No username");
  });

  it("throws an error for empty password", () => {
    expect(() => user({ username: "xyz" })).toThrow("No password");
  });

  it("throws an error for username with A", () => {
    expect(() => user({ username: "Abc", password: "a" })).toThrow(
      "Invalid username"
    );
  });

  it("throws an error for unmatched username", () => {
    expect(() => user({ username: "house", password: "house" })).toThrow(
      "Invalid password"
    );
  });

  it("returns user id for matched username", () => {
    expect(user({ username: "mango", password: "MANGO" })).toEqual({
      userId: "mango",
    });
  });
});
