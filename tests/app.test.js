const request = require("supertest");
const express = require("express");
const jsonata = require("jsonata");

// Import the app logic from index.js and ensure it exports the Express app
let app;
try {
  app = require("../index");
  if (typeof app !== "function" || !app.handle) {
    throw new Error(
      "The exported value from index.js is not an Express app. Please export the app instance using module.exports = app;",
    );
  }
} catch (err) {
  throw new Error(
    `Failed to import the Express app from ../index.js: ${err.message}\n` +
      "Make sure index.js exists, has no syntax errors, and exports the Express app instance.",
  );
}

describe("POST /api/jsonata", () => {
  it("should evaluate a valid JSONata query", async () => {
    const res = await request(app)
      .post("/api/jsonata")
      .send({ json: { foo: 42 }, query: "foo" });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(42);
  });

  it("should return error for invalid JSONata query", async () => {
    const res = await request(app)
      .post("/api/jsonata")
      .send({ json: { foo: 42 }, query: "foo.." });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return error for invalid JSON input", async () => {
    const res = await request(app)
      .post("/api/jsonata")
      .send({ json: null, query: "foo" });
    expect(res.statusCode).toBe(400);
  });
});

