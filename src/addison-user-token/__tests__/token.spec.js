import { issueToken, requestToken } from "../token.js";

describe("issueToken", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  it("throws error for empty username", () => {
    expect(() => issueToken()).toThrow("No userid");
  });

  it("returns token", () => {
    expect(issueToken("house")).toEqual({
      token: "house_2020-01-01T00:00:00.000Z",
    });
  });
});

describe("requestToken", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });
  it("returns token", () => {
    expect(requestToken({ username: "house", password: "HOUSE" })).toEqual({
      token: "house_2020-01-01T00:00:00.000Z",
    });
  });
});
