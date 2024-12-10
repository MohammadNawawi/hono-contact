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

describe("GET /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should get 404 if contact not found", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should success if contact is exists", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe(contact.first_name);
    expect(body.data.last_name).toBe(contact.last_name);
    expect(body.data.email).toBe(contact.email);
    expect(body.data.phone).toBe(contact.phone);
    expect(body.data.id).toBe(contact.id);
  });
});

describe("PUT /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected update contact if request is invalid", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "PUT",
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

  it("should rejected update contact if id is not found", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "PUT",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Mohammad",
      }),
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should success update contact if request is valid", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "PUT",
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

describe("DELETE /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected delete contact if contact id is not found", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should success delete contact if contact id is exist", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBe(true);
  });
});
