import { NextFunction, Response } from "express";
import { Request } from "express-validator/src/base.js";
import jwt, { Jwt } from "jsonwebtoken";
import { APIError } from "../routes/auth_routes.js";

export const authenticateAccessToken = async (
  req: Request,
  res: Response,
  nex: NextFunction
) => {
  try {
    if (!req.headers) {
      throw {
        error: "validation",
        code: 400,
        payload: "missing access token",
      };
    }

    const authHeaders =
      req.headers["Authorization"] || req.headers["authorization"];

    if (!authHeaders) {
      throw {
        error: "validation",
        code: 400,
        payload: "missing access token",
      };
    }
    const token = authHeaders.split(" ")[1];

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: any, authUser: any) => {
        if (err)
          throw {
            error: "validation",
            payload: "the token provided is invalid or expired",
            code: 403,
          };
      }
    );
    nex();
  } catch (err) {
    console.log(err);
    const knownError = err as APIError;
    res.statusCode = knownError.code || 500;
    res.send(knownError);
  }
};
