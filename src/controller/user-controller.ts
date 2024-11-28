import { Hono } from "hono";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UpdateUserRequest,
} from "../model/user-model";
import { userService } from "../service/user-service";
import { ApplicationVariables } from "../model/app-model";
import { User } from "@prisma/client";

export const userController = new Hono<{ Variables: ApplicationVariables }>();

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

userController.use(async (c, next) => {
  const token = c.req.header("Authorization");
  const user = await userService.get(token);

  c.set("user", user);

  return next();
});

userController.get("/api/users/current", async (c) => {
  const user = c.get("user") as User;

  return c.json({
    data: toUserResponse(user),
  });
});

userController.patch("/api/users/current", async (c) => {
  const user = c.get("user") as User;
  const request = (await c.req.json()) as UpdateUserRequest;
  const response = await userService.update(user, request);

  return c.json({
    data: response,
  });
});

userController.delete("/api/users/current", async (c) => {
  const user = c.get("user") as User;

  const response = await userService.logout(user);

  return c.json({
    data: response,
  });
});
