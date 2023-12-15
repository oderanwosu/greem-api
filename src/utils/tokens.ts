import jwt, { Jwt } from "jsonwebtoken";

export function generateAccessToken(authUser: Object): string {
  let token = jwt.sign(authUser, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "604800s",
  });
  return token;
}
export function generateRefreshToken(authUser: Object): string {
  let token = jwt.sign(authUser, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1209600s",
  });
  return token;
}
