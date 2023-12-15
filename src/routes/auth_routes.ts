import { Response, Router } from "express";
import { Request } from "express-serve-static-core";
import {body, validationResult } from 'express-validator';
let _router = Router();


interface APIError {
    error: string,
    code: number,
    payload: any
}

const loginValidators = [body("email").isEmail(), body("email").isLength({max: 50}), body("password").matches(/[A-Z]/).withMessage("Must contain at least 1 uppercase letter"), body("password").matches(/[d]/).withMessage("Must contain at least 1 number")]
_router.post("/register",loginValidators, (req: Request, res: Response) => {
try {
    const validationErrors = validationResult(req)
    console.log(req.body)
    if(!validationErrors.isEmpty()){
        throw {error: 'validation', code: 422, payload: validationErrors.array()}
    }

    

} catch (err: unknown)  {
    const knownError = err as APIError
    res.statusCode = knownError.code || 500
    res.send(knownError)
}
});
export const authRoutes = _router;