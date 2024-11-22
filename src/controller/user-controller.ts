import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest } from "../model/user-model";
import { userService } from "../service/user-service";

export const userController = new Hono();

userController.post("/api/users", async (c) => {
  const request = (await c.req.json()) as RegisterUserRequest;

  // TODO : Send to service
  const response = await userService.register(request);

  // TODO : Return Response
  return c.json({
    data: response,
  });
});

userController.post("/api/users/login", async (c) => {
  const request = (await c.req.json()) as LoginUserRequest;

  // TODO : Send to service
  const response = await userService.login(request);

  // TODO : Return Response
  return c.json({
    data: response,
  });
});
