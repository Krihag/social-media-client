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

global.localStorage = {
  setItem: jest.fn(function (key, value) {
    this[key] = value;
  }),
};

describe("SaveLocalStorage", () => {
  it("should save to local storage", () => {
    storage.save("key", "value");
    expect(localStorage.key).toEqual(JSON.stringify("value"));
  });
});

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

    expect(localStorage.token).toEqual(JSON.stringify("test"));
    expect(localStorage.profile).toEqual(
      JSON.stringify({
        username: "test",
        email: "test@noroff.no",
      })
    );

    expect(localStorage.setItem).toHaveBeenCalledTimes(3);
  });
});
