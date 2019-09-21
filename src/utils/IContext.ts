import { IUser } from "../User/User.model";
import { TokenPayload } from "./TokenAPI";

export default interface IContext {
  user: TokenPayload & {token?: string}
}