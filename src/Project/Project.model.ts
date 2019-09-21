import { Field, ObjectType } from "type-graphql";
import { model, Schema, Document } from "mongoose";
import { User } from "../User/User.model";
import { Task } from "../Task/Task.model";

@ObjectType()
export class Project {

  @Field()
  _id: string;

  @Field()
  name: string;

  @Field(type => [Task])
  tasks: Task[];

  @Field(type => [User])
  users: User[]
}

export interface IProject {
  _id: string;
  name: string;
  users: string[]
}

export const ProjectModel = model<IProject & Document>("Project", new Schema({
  id: Schema.Types.ObjectId,
  name: {
    type: String,
    validate: {
      validator: (text: string) => text != null || text != "",
      msg: "name is required"
    }
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
})) 