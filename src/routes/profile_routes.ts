import { Router } from "express";
import { Request } from "express-serve-static-core";
import { body } from "express-validator";
import { authenticateAccessToken, validate } from "../utils/middleware.js";
import {
  APIError,
  AuthenticatedResponse,
  Profile,
  UserProfile,
} from "../utils/interfaces.js";
import {
  createUserProfile,
  getUserProfileByID,
  getUserProfileByProfileID,
  getUserProfileByUsername,
  updateUserProfile,
} from "../services/firestore_services.js";
import { determineScope, scopeProfile } from "../utils/scopes.js";
import { updateProfile } from "firebase/auth";

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

      await createUserProfile(
        res.authUser!.id,
        res.authUser!.email,
        username,
        data.dob
      );
      res.sendStatus(202);
    } catch (err) {
      console.log(err);
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);

_router.get(
  "/",
  authenticateAccessToken,
  async (req: Request, res: AuthenticatedResponse) => {
    try {
      var profile = req.query["username"]
        ? await getUserProfileByUsername(req.query["username"] as string)
        : req.query["profileID"]
        ? await getUserProfileByProfileID(req.query["profileID"] as string)
        : await getUserProfileByID(res.authUser?.id as string);

      if (profile == null)
        throw {
          error: "profile",
          code: 401,
          payload: "Profile does not exist",
        };
      var profileInterface = profile as UserProfile;
      res.send(
        scopeProfile(
          profileInterface,
          determineScope(res.authUser!.id, {
            targetAuthID: profileInterface.authID,
          })
        )
      );
    } catch (err) {
      console.log(err);
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);

_router.post(
  "/update",
  authenticateAccessToken,
  async (req: Request, res: AuthenticatedResponse) => {
    try {
      let changes = req.body;
      console.log(changes);
      updateUserProfile(res.authUser!.id, {
        username: changes.username,
        biography: changes.biography,
        isActivityPublic: changes.isActivityPublic,
        isDOBPublic: changes.isDOBPublic,
        isEmailPublic: changes.isEmailPublic,
      });

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      const knownError = err as APIError;
      res.statusCode = knownError.code || 500;
      res.send(knownError);
    }
  }
);

export const profileRoutes = _router;
