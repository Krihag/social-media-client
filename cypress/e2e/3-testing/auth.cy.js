/// COMMANDS ///

Cypress.Commands.add("getLoginForm", () => {
  cy.get("#registerForm").find("button[data-auth=login]").click();
  cy.get("#loginForm").should("be.visible");
  cy.wait(500);
});

Cypress.Commands.add("loginRequest", (email, password) => {
  cy.intercept({
    method: "POST",
    url: "**/api/v1/social/auth/login",
  }).as("loginRequest");

  cy.get("#loginForm").find('input[name="email"]').type(email);
  cy.get("#loginForm").find('input[name="password"]').type(password);
  cy.get("#loginForm").find("button[type=submit]").click();
  cy.wait(1500);
});

// Logout command
Cypress.Commands.add("logoutReq", () => {
  cy.get('button[data-auth="logout"]').click();
  cy.wait(1500);
});

/// TESTS ///

// tests for login with valid information
describe("correctLogin", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.wait(1000);
  });

  it("sends a login request with valid user information", () => {
    cy.getLoginForm();
    cy.loginRequest(Cypress.env("email"), Cypress.env("password"));
    cy.wait("@loginRequest");
  });

  it("responds with status code 200 (sucessfull)", () => {
    cy.getLoginForm();
    cy.loginRequest(Cypress.env("email"), Cypress.env("password"));
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  });

  it("stores a token in localStorage", () => {
    cy.getLoginForm();
    cy.loginRequest(Cypress.env("email"), Cypress.env("password"));
    cy.window().its("localStorage.token").should("exist");
  });

  it("stores profile info in localStorage", () => {
    cy.getLoginForm();
    cy.loginRequest(Cypress.env("email"), Cypress.env("password"));
    cy.window().its("localStorage.profile").should("exist");
  });

  it("redirects to the profile page", () => {
    cy.getLoginForm();
    cy.loginRequest(Cypress.env("email"), Cypress.env("password"));
    cy.url().should(
      "eq",
      "http://127.0.0.1:5500/?view=profile&name=testuser123453253"
    );
  });
});

// Tests for login with invalid  information
describe("wrongLogin", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.wait(1000);
  });

  it("sends a login request with invalid data", () => {
    cy.getLoginForm();
    cy.loginRequest("incorrectEmail@noroff.no", "incorrectPassword");
    cy.wait("@loginRequest");
  });

  it("responds with status code 401 (unsucessfull)", () => {
    cy.getLoginForm();
    cy.loginRequest("incorrectEmail@noroff.no", "incorrectPassword");
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 401);
  });

  it("displays alert with specific message", () => {
    cy.getLoginForm();
    cy.loginRequest("invalidemail@example.com", "invalidpassword");

    // expect gave me errors so I used assert instead
    cy.on("window:alert", (err) => {
      assert.include(
        err,
        "Either your username was not found or your password is incorrect"
      );
    });
  });

  it("does not redirect to a different page", () => {
    cy.getLoginForm();
    cy.loginRequest("incorrectEmail@noroff.no", "incorrectPassword");
    cy.url().should("eq", "http://127.0.0.1:5500/");
  });

  it("does not store a token in localStorage", () => {
    cy.getLoginForm();
    cy.loginRequest("incorrectEmail@noroff.no", "incorrectPassword");
    cy.window().its("localStorage.token").should("be.undefined");
  });

  it("does not store profile info in localStorage", () => {
    cy.getLoginForm();
    cy.loginRequest("incorrectEmail@noroff.no", "incorrectPassword");
    cy.window().its("localStorage.profile").should("be.undefined");
  });
});

// Logout test

describe("logout", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.wait(1000);
  });

  it("logs out the user and redirect to register/login page", () => {
    cy.getLoginForm();
    cy.loginRequest(Cypress.env("email"), Cypress.env("password"));
    cy.logoutReq();
    cy.url().should("eq", "http://127.0.0.1:5500/");
  });

  it("removes token from localStorage", () => {
    cy.getLoginForm();
    cy.loginRequest(Cypress.env("email"), Cypress.env("password"));
    cy.window().its("localStorage.token").should("exist");
    cy.logoutReq();
    cy.window().its("localStorage.token").should("be.undefined");
  });

  it("removes profile info from localStorage", () => {
    cy.getLoginForm();
    cy.loginRequest(Cypress.env("email"), Cypress.env("password"));
    cy.window().its("localStorage.profile").should("exist");
    cy.logoutReq();
    cy.window().its("localStorage.profile").should("be.undefined");
  });
});
