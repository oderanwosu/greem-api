import { Response, Router } from "express";
import { Request } from "express-serve-static-core";
import { body, validationResult } from "express-validator";
import {
  createAuthenticationUser,
  isAuthenticationEmailExisting,
} from "../services/firestore_services.js";
import { uuidv4 } from "@firebase/util";
import { compare, hash } from "bcrypt";
let _router = Router();

interface APIError {
  error: string;
  code: number;
  payload: any;
}

const loginValidators = [
  body("email").isEmail(),
  body("email").isLength({ max: 50 }),
  body("password")
    .matches(/[A-Z]/)
    .withMessage("Must contain at least 1 uppercase letter"),
  body("password").matches(/[d]/).withMessage("Must contain at least 1 number"),
];
_router.post(
  "/register",
  loginValidators,
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
      if (await isAuthenticationEmailExisting(data.email)) {
        throw {
          error: "validation",
          code: 422,
          payload: "Email already exist.",
        };
      }
      //creates a new auth user into the database
      await createAuthenticationUser(uuidv4(), data.email, await hash(data.password, 10));

      res.sendStatus(201)
    } catch (err: unknown) {
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);


_router.post("/login", 
body("password").notEmpty(), )
export const authRoutes = _router;
