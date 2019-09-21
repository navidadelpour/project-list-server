import { Field, Int, ObjectType } from "type-graphql";
import { Schema, Document, model } from "mongoose";
import { Project } from "../Project/Project.model";

@ObjectType()
export class Task {
  @Field()
  _id: string;

  @Field()
  title: string;

  @Field(type => Project)
  project: Project;

  @Field({defaultValue: false})
  completed: boolean;
}

export interface ITask {
  _id: string;
  title: string;
  completed: boolean;
  project_id: string;
}

export const TaskModel = model<ITask & Document>("Task", new Schema({
  id: Schema.Types.ObjectId,
  title: {
    type: String,
    validate: {
      validator: (text: string) => text != null || text != "",
      msg: "title is required"
    }
  },
  completed: {
    type: Boolean
  },
  project_id: {
    type: String
  },
}))