require("dotenv/config");
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
  env: {
    password: process.env.USER_PASSWORD,
    email: process.env.USER_EMAIL,
  },
});
