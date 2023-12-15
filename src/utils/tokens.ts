import jwt, { Jwt } from "jsonwebtoken";

/**
 * Generates a refresh token using auth user information and refresh token.
 *
 * @param {Object} authUser User's account object.
 * @returns {String} an access token using the access token secret; Expires in 1 weeks
 */
export function generateAccessToken(authUser: Object): string {
  let token = jwt.sign(authUser, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "604800s",
  });
  return token;
}

/**
 * Generates a refresh token using auth user information and refresh token.
 *
 * @param {Object} authUser User's account object.
 * @returns {String} a refresh token using the refresh token secret; Expires in 2 weeks
 */
export function generateRefreshToken(authUser: Object): string {
  let token = jwt.sign(authUser, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1209600s",
  });
  return token;
}
