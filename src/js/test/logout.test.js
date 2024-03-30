import { logout } from "../api/auth/logout.js";
import * as storage from "../storage/index.js";

global.localStorage = {
  setItem: jest.fn(function (key, value) {
    this[key] = value;
  }),
  removeItem: jest.fn(function (key) {
    delete this[key];
  }),
};

describe("logoutUser", () => {
  it("Should remove token and profile from local storage", () => {
    storage.save("token", "test");
    storage.save("profile", "test");
    expect(localStorage.token).toEqual(JSON.stringify("test"));
    expect(localStorage.profile).toEqual(JSON.stringify("test"));
    logout();
    expect(localStorage.token).toBeUndefined();
    expect(localStorage.profile).toBeUndefined();
  });
});
