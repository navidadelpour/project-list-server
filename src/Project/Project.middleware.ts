import { MiddlewareFn } from "type-graphql";
import { ProjectModel } from "./Project.model";
import IContext from "../utils/IContext";


const ProjectMiddleware: MiddlewareFn<any> = async ({args, context}: {args: any, context: IContext}, next) => {
  const project = await ProjectModel.findById(args.id)
  if(!project) throw new Error('this project does not exists')
  if(!project.users.find(id => id == context.user.id)) {
    throw new Error ("not allowed to see this resource")
  }
  return next()
}

export default ProjectMiddleware