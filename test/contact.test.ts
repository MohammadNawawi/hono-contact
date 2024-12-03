import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { ContactTest, UserTest } from "./test-util";
import app from "../src";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be rejected if token invalid", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "salah",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();

    expect(body.errors).toBeDefined();
  });

  it("should be rejected if user is invalid", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();

    expect(body.errors).toBeDefined();
  });

  it("should be rejected if user is valid (only first_name)", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Mohammad",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Mohammad");
    expect(body.data.last_name).toBeNull();
    expect(body.data.email).toBeNull();
    expect(body.data.phone).toBeNull();
  });

  it("should be rejected if user is valid (full data)", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Mohammad",
        last_name: "Nawawi",
        email: "nawawi@naw.id",
        phone: "123456789",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Mohammad");
    expect(body.data.last_name).toBe("Nawawi");
    expect(body.data.email).toBe("nawawi@naw.id");
    expect(body.data.phone).toBe("123456789");
  });
});
