import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UpdateUserRequest,
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

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    // * Request Validation
    request = userValidation.LOGIN.parse(request);

    // * Check on Database
    let user = await prismaClient.user.findUnique({
      where: {
        username: request.username,
      },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Username or password is wrong!",
      });
    }

    // * Hashing password using bcrypt
    const isPasswordValid = await Bun.password.verify(
      request.password,
      user.password,
      "bcrypt"
    );

    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: "Username or password is wrong!",
      });
    }

    user = await prismaClient.user.update({
      where: {
        username: request.username,
      },
      data: {
        token: crypto.randomUUID(),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(token: string | undefined | null): Promise<User> {
    const result = userValidation.TOKEN.safeParse(token);
    if (result.error) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }
    token = result.data;
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    return user;
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    request = userValidation.UPDATE.parse(request);

    if (request.name) {
      user.name = request.name;
    }

    if (request.password) {
      user.password = await Bun.password.hash(request.password, {
        algorithm: "bcrypt",
        cost: 10,
      });
    }

    user = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(user);
  }

  static async logout(user: User): Promise<boolean> {
    await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return true;
  }
}
