import jwt, { SignOptions } from 'jsonwebtoken'
import { Request } from 'express';
import { Roles } from '../User/User.model';

export interface TokenPayload {
  id: string,
  role: Roles
}

const JWTSecret = "somesecretgoeshere"

export default class TokenAPI {

  static generate(payLoad: TokenPayload, options?: SignOptions): string {
    return jwt.sign(payLoad, JWTSecret, options)
  }

  static verify(token: string): string | object {
    return jwt.verify(token, JWTSecret)
  }

  static extract(req: Request) : string {
    return req.headers.authorization && req.headers.authorization.replace("Bearer ", "")
  }

}
