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
import { authenticateAccessToken } from "../utils/middleware.js";
import { APIError } from "../utils/interfaces.js";
let _router = Router();



const registerValidators = [
  body("email").isEmail(),
  body("email").isLength({ max: 50 }),
  body("password")
    .matches(/[A-Z]/)
    .withMessage("Must contain at least 1 uppercase letter"),
  body("password").matches(/[d]/).withMessage("Must contain at least 1 number"),
];
_router.post(
  "/register",
  registerValidators,
  async (req: Request, res: Response) => {
    try {
      //Checks if email and password are formatted correctly.
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        throw {
          error: "validation",
          code: 422,
          payload: validationErrors.array(),
        };
      }

      let data = req.body;
      //Checks if email already exist in database.
      if ((await getAuthenticationUserFromEmail(data.email)) != null) {
        throw {
          error: "validation",
          code: 422,
          payload: "User with email already exist.",
        };
      }

      //creates a new auth user into the database
      await createAuthenticationUser(
        uuidv4(),
        data.email,
        await hash(data.password, Number.parseInt(process.env.HASH_SALT!))
      );

      res.sendStatus(201);
    } catch (err: unknown) {
      console.log(err);
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);

const loginValidators = [
  body("password").notEmpty(),
  body("email").isEmail(),
  body("email").isLength({ max: 50 }),
];
_router.post("/login", loginValidators, async (req: Request, res: Response) => {
  try {
    //Check for email and password validations.If invalid respond with a validation issue.
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      throw {
        error: "validation",
        code: 422,
        payload: validationErrors.array(),
      };
    }

    let receivedEmail = req.body.email;
    let receivedPassword = req.body.password;
    let dbAuthUser = await getAuthenticationUserFromEmail(receivedEmail);
    //check if a database user exist there.
    if (dbAuthUser == null) {
      throw {
        error: "validation",
        code: 401,
        payload: "email or password is incorrect",
      };
    }

    //compare hashed passwords to each other.
    if (!compare(receivedPassword, dbAuthUser.password)) {
      throw {
        error: "validation",
        code: 401,
        payload: "email or password is incorrect",
      };
    }

    //generate access token and refresh tokens.
    const accessToken = generateAccessToken(dbAuthUser);
    const refreshToken = generateRefreshToken(dbAuthUser);
    //Get the approximate date the tokens expire.
    let accessTokenExpirationDate = new Date(Date.now() + 604800 * 1000);
    let refreshTokenExpirationDate = new Date(Date.now() + 1209600 * 1000);
    await addRefreshTokenToDatabase(refreshToken);

    //send status
    res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpirationDate: accessTokenExpirationDate,
      refreshTokenExpirationDate: refreshTokenExpirationDate,
    });
  } catch (err) {
    const knownError = err as APIError;
    res.statusCode = knownError.code || 500;
    res.send(knownError);
  }
});

_router.delete(
  "/logout",
  authenticateAccessToken,
  [body("refreshToken").isJWT() /** Ensure the body contains a refreshToken that is token */],
  async (req: Request, res: Response) => {
    try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        throw {
          error: "validation",
          code: 422,
          payload: validationErrors.array(),
        };
      }
      //Delete the refreshToken from the database. Doing so, ddisables the user from authenticating again once their accessToken is gone. 
      await deleteRefreshTokenFromDatabase(req.body.refreshToken);
      res.sendStatus(204);
    } catch (err) {
      console.log(err)
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);



export const authRoutes = _router;
