import { Query, Resolver, Arg, Mutation, FieldResolver, Root, UseMiddleware, Authorized } from "type-graphql";
import { Task, TaskModel, ITask } from "./Task.model";
import { ProjectModel, IProject } from "../Project/Project.model";
import ProjectMiddleware from "../Project/Project.middleware";
import TaskMiddleware from "./Task.middleware";

@Resolver(of => Task)
export default class {

  
  @Query(returns => [Task])
  async allTasks(): Promise<ITask[]> {
    return TaskModel.find({})
  }

  @Authorized()
  @UseMiddleware(ProjectMiddleware)
  @Query(returns => [Task])
  async tasks(@Arg("id") id: string) : Promise<ITask[]> {
    return TaskModel.find({project_id: id})
  }

  @Authorized()
  @UseMiddleware(TaskMiddleware)
  @Query(returns => Task)
  async getTask(@Arg("id") id: string) : Promise<ITask | undefined> {
    return TaskModel.findById(id)
  }

  @Authorized()
  @UseMiddleware(TaskMiddleware)
  @Mutation(returns => Task)
  async toggleCompleted(@Arg('id') id: string) : Promise<ITask> {
    let task: ITask = await TaskModel.findById(id)

    if(!task) throw new Error("task not found")
    
    return TaskModel.findByIdAndUpdate(id, {completed: !task.completed})
  }

  @Authorized()
  @UseMiddleware(ProjectMiddleware)
  @Mutation(returns => Task)
  async addTask(
    @Arg("id") projectId: string,
    @Arg("title") title: string,
    @Arg("completed") completed: boolean
  ): Promise<ITask> {
    const task = new TaskModel(({
      title: title,
      project_id: projectId,
      completed: completed
    }))
    return task.save()
  }

  @Authorized()
  @UseMiddleware(TaskMiddleware)
  @Mutation(returns => Task)
  async removeTask(@Arg("id") id: string): Promise<ITask> {
    return TaskModel.findByIdAndDelete(id)
  }

  @Authorized()
  @UseMiddleware(TaskMiddleware)
  @Mutation(returns => Task)
  async updateTask(@Arg("id") id: string, @Arg("title") title: string): Promise<ITask> {
    return TaskModel.findByIdAndUpdate(id, {title: title})
  }

  @FieldResolver()
  async project(@Root() task: ITask): Promise<IProject> {
    return ProjectModel.findById(task.project_id)
  }
}