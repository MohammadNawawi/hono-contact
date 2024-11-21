import { prismaClient } from "../application/database";
import {
  RegisterUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { userValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";

export class userService {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    // * Request Validation
    request = userValidation.REGISTER.parse(request);

    // * Check on Database
    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HTTPException(400, {
        message: "Username already exist",
      });
    }

    // * Hashing password using bcrypt
    request.password = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // * Save to Database
    const user = await prismaClient.user.create({
      data: request,
    });
    // * Return Response

    return toUserResponse(user);
  }
}
