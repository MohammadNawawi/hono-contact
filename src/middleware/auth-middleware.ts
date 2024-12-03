import { MiddlewareHandler } from "hono";
import { userService } from "../service/user-service";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("Authorization");
  const user = await userService.get(token);

  c.set("user", user);

  return next();
};