import { Arg, FieldResolver, Query, Resolver, Root, Mutation, Int, ObjectType, Ctx, Field, Authorized, UseMiddleware } from "type-graphql";
import { Project, ProjectModel, IProject } from "./Project.model";
import Count from "../utils/Count";
import { ICount } from "../utils/Count";
import { ITask, TaskModel } from "../Task/Task.model";
import { UserModel, IUser } from "../User/User.model";
import ProjectMiddleware from "./Project.middleware";
import IContext from "../utils/IContext";

@Resolver(of => Project)
export default class {
  
  @Authorized()
  @Query(returns => [Project], {nullable: true})
  async projects(@Ctx() context: IContext): Promise<IProject[]> {
    return await ProjectModel.find({users: {$in: context.user.id}})
  }

  @Authorized()
  @UseMiddleware(ProjectMiddleware)
  @Query(returns => Project, { nullable: true })
  async project(
    @Arg("id", {nullable: true}) id: string,
  ): Promise<IProject | undefined> {
    return ProjectModel.findById(id)
  }

  @Authorized()
  @Mutation(returns => Project)
  async addProject(@Arg("name") name: string, @Ctx() context: IContext) : Promise<IProject> {
    const project = new ProjectModel({name: name, users: [context.user.id]})
    return project.save()
  }

  @Authorized()
  @UseMiddleware(ProjectMiddleware)
  @Mutation(returns => Project)
  async updateProject(@Arg("id") id: string, @Arg("name") name: string): Promise<IProject>{
    return ProjectModel.findByIdAndUpdate(id, {name})
  }

  @Authorized()
  @UseMiddleware(ProjectMiddleware)
  @Mutation(returns => Project)
  async removeProject(@Arg("id") id: string): Promise<IProject>{
    return ProjectModel.findByIdAndDelete(id)
  }

  @Authorized()
  @Mutation(returns => Count)
  async removeProjects(@Ctx() context: IContext): Promise<ICount> {
    return ProjectModel.find({users: {$in: context.user.id}}).exec()
      .then(data => {
        let count = data.length
        data.forEach(d => d.remove())
        return {count: count}
      })
  }

  @Authorized()
  @UseMiddleware(ProjectMiddleware)
  @Mutation(returns => Project)
  async addUser(@Arg("id") id: string, @Arg("email") email: string): Promise<IProject> {
    let project = await ProjectModel.findById(id)
    let user = await UserModel.findOne({email: email})

    if(!user) throw new Error("this user doesnt exists")
    
    if(project.users.find(id => String(id) == String(user._id))) {
      throw new Error("user added on project before")
    }

    project.users.push(user._id)
    return project.save()
  }

  @Authorized()
  @UseMiddleware(ProjectMiddleware)
  @Mutation(returns => Project)
  async removeUser(@Arg("id") id: string, @Arg("email") email: string): Promise<IProject> {
    let project = await ProjectModel.findById(id)
    let user = await UserModel.findOne({email: email})

    if(!user) throw new Error("this user doesnt exists")
    
    if(!project.users.find(id => String(id) == String(user._id))) {
      throw new Error("user not exists in this project")
    }

    project.users = project.users.filter(id => String(id) != String(user._id))
    return project.save()
  }

  @FieldResolver()
  async tasks(@Root() project: IProject): Promise<ITask[]> {
    return TaskModel.find({project_id: project._id})
  }

  @FieldResolver()
  async users(@Root() project: IProject): Promise<IUser[]> {
    return UserModel.find({_id: {$in: project.users}})
  }
    
}

@ObjectType()
class x {
  @Field()
  d: string
}