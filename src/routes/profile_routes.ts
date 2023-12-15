import { Response, Router } from "express";
import { Request } from "express-serve-static-core";
import { body, validationResult } from "express-validator";
import {
  addRefreshTokenToDatabase,
  createAuthenticationUser,
  deleteRefreshTokenFromDatabase,
  getAuthenticationUserFromEmail,
} from "../services/auth_firestore_services.js";
import { uuidv4 } from "@firebase/util";
import { compare, hash } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { authenticateAccessToken, validate } from "../utils/middleware.js";
import { APIError, AuthenticatedResponse } from "../utils/interfaces.js";
import { getUserAccountByID } from "../services/firestore_services.js";
let _router = Router();

const accountCreatorValidators = [
  body("username").isLowercase(),
  body("username").isLength({ max: 20, min: 3 }),
  body("dob").isDate(),
];

_router.post(
  "/create",
  authenticateAccessToken,
  accountCreatorValidators,
  validate,
  async (req: Request, res: AuthenticatedResponse) => {
    try {
      if (await getUserAccountByID(res.authUser?.id || "")) {
        throw {
          error: "validatino",
          code: 422,
          payload: "Account already exist",
        };
      }
    } catch (err) {
      console.log(err);
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);

export const profileRoutes = _router;
