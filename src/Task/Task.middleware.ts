import { MiddlewareFn, ResolverData } from "type-graphql";
import { TaskModel } from "./Task.model";
import ProjectMiddleware from "../Project/Project.middleware";


const TaskMiddleware: MiddlewareFn<any> = async ({args, context, root, info}, next) => {
  const task = await TaskModel.findById(args.id)
  return ProjectMiddleware({args: {id: task.project_id}, context, root, info}, next)
}

export default TaskMiddleware