import { ObjectType, Field, registerEnumType } from "type-graphql";
import { Project } from "../Project/Project.model";
import { model, Document, Schema } from "mongoose";

@ObjectType()
export class User {
  @Field()
  _id: String

  @Field()
  username: String

  @Field()
  email: String

  @Field()
  password: String

  @Field({nullable: true})
  token?: String

  @Field(type => Roles)
  role: Roles

  @Field(type => [Project])
  projects: Project[]

}

export enum Roles {
  ADMIN, USER
}

registerEnumType(Roles, {name: "Roles", description: "application roles"})

export interface IUser {
  _id: string,
  username: string,
  email: string,
  password: string
  token: string,
  role: Roles
}

export const UserModel = model<IUser & Document>("User", new Schema({
  id: Schema.Types.ObjectId,
  username: String,
  email: String,
  password: String,
  token: {
    type: String,
    default: null
  },
  role: {
    type: Number,
    enum: Roles
  }
}))