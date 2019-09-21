import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { User, IUser, UserModel, Roles } from "./User.model";
import bcrypt from 'bcryptjs'
import TokenAPI from "../utils/TokenAPI";
import IContext from "../utils/IContext";
 
@Resolver(of => User)
export default class {

  @Query(returns => [User])
  async users(): Promise<IUser[]> {
    return UserModel.find({})
  }

  @Mutation(returns => User)
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("username") username: string
  ): Promise<IUser> {
    const user = new UserModel({
      email,
      username,
      password: await bcrypt.hash(password, 1),
      role: Roles.USER
    })

    user.token = TokenAPI.generate({id: user._id, role: user.role})

    return user.save()
  }

  @Mutation(returns => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<IUser> {

    const user = await UserModel.findOne({email: email}).exec()

    if(!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("wrong email and password")
    }

    user.token = TokenAPI.generate({id: user._id, role: user.role})

    return user.save()
  }

  @Authorized()
  @Mutation(returns => User)
  async logout(@Ctx() context: IContext): Promise<IUser> {
    const user = await UserModel.findById(context.user.id)
    user.token = null
    return user.save()
  }

  @Authorized()
  @Query(returns => User)
  async me(@Ctx() context: IContext) : Promise<IUser> {
    return await UserModel.findById(context.user.id)
  }

  @Mutation(returns => String)
  async removeAll(): Promise<string> {
    await UserModel.deleteMany({})
    return "done"
  }
}