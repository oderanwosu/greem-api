import { NextFunction, Response } from "express";
import { Request } from "express-validator/src/base.js";
import jwt, { Jwt } from "jsonwebtoken";
import { APIError, AuthenticatedResponse } from "./interfaces.js";
import { validationResult } from "express-validator";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

export const authenticateAccessToken = async (
  req: Request,
  res: AuthenticatedResponse,
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

        res.authUser = { id: authUser.id, email: authUser.email };
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

export const validate = async (req: Request, res: any, nex: any) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) 
    res.send({
      error: "validation",
      code: 422,
      payload: validationErrors.array(),
    });
   else nex()
};

export const applyMiddleWareConfigurations = (app: any) => {
  app.use(bodyParser.json({ limit: "30mb" }));
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(cors());
  return app
};
