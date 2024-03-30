import { login } from "../api/auth/login.js";
import * as storage from "../storage/index.js";

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({
    accessToken: "test",
    username: "test",
    email: "test@noroff.no",
  }),
});

jest.mock("../storage/index.js", () => ({
  save: jest.fn(),
  load: jest.fn(),
}));

jest.mock("../api/constants.js", () => ({
  apiPath: "https://example.com/api",
}));

describe("login", () => {
  it("should return token and profile", async () => {
    await login("username", "password");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/api/social/auth/login",
      {
        method: "post",
        body: JSON.stringify({ email: "username", password: "password" }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(storage.save).toHaveBeenCalledWith("token", "test");
    expect(storage.save).toHaveBeenCalledWith("profile", {
      username: "test",
      email: "test@noroff.no",
    });

    expect(storage.save).toHaveBeenCalledTimes(2);
  });
});
