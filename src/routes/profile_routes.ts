import { Router } from "express";
import { Request } from "express-serve-static-core";
import { body } from "express-validator";
import { authenticateAccessToken, validate } from "../utils/middleware.js";
import { APIError, AuthenticatedResponse } from "../utils/interfaces.js";
import {
  createUserProfile,
  getUserProfileByID,
  getUserProfileByUsername,
} from "../services/firestore_services.js";

let _router = Router();

const accountCreatorValidators = [
  body("username").isLowercase(),
  body("username").isLength({ max: 20, min: 3 }),
  body("dob").isString(),
  
];

_router.post(
  "/create",
  authenticateAccessToken,
  accountCreatorValidators,
  validate,
  async (req: Request, res: AuthenticatedResponse) => {
    try {
      if (await getUserProfileByID(res.authUser?.id || ""))
        throw {
          error: "validation",
          code: 422,
          payload: "Profile already exist",
        };

      let data = req.body;
      let username = data.username;
      if (await getUserProfileByUsername(username))
        throw {
          error: "username",
          code: 422,
          payload: "That username is already used",
        };
      
      await createUserProfile(res.authUser!.id, res.authUser!.email, username, data.dob)
      res.sendStatus(202)
      
    } catch (err) {
      console.log(err);
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);

_router.post(
  "/",
  authenticateAccessToken,
  async (req: Request, res: AuthenticatedResponse) => {
    try {

      var profile = await getUserProfileByID(res.authUser?.id || "")
      if (!profile)
        throw {
          error: "profile",
          code: 401,
          payload: "Profile does not exist",
        };

     
    } catch (err) {
      console.log(err);
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);
export const profileRoutes = _router;
