import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Tasks } from "../entitity/Tasks";

@Resolver()
export class TaskResolver {
  @Mutation(() => Boolean)
  async deleteTask(@Arg("id") id: number) {
    try {
      await Tasks.delete(id);
    } catch (err) {
      console.log(err);
    }
    return true;
  }

  @Query(() => [Tasks])
  getTasks() {
    return Tasks.find();
  }

  @Query(() => Tasks)
  async getTask(@Arg("id") id: number) {
    return await Tasks.findOneById(id);
  }

  @Query(() => [Tasks])
  async getProjectTasks(@Arg("id") id: number) {
    const tasks = await Tasks.find();

    const projectTasks = tasks.filter((task) => task.projectId === id);

    return projectTasks;
  }

  @Query(() => [Tasks])
  async getUsersTasks(@Arg("id") userId: number) {
    const tasks = await Tasks.find();

    const userTasks = tasks.filter(
      (task) =>
        task.members.includes(userId.toString()) || task.creator === userId
    );

    return userTasks;
  }

  @Mutation(() => Tasks)
  async updateTask(
    @Arg("id") id: number,
    @Arg("isComplete") isComplete: boolean
  ) {
    const task = await Tasks.findOneBy({ id: id });

    await Tasks.update({ id: id }, { isComplete: isComplete });

    return task;
  }

  @Mutation(() => Boolean)
  async createTask(
    @Arg("creator") creator: number,
    @Arg("taskName") taskName: string,
    @Arg("completeDate") completeDate: string,
    @Arg("members") members: string,
    @Arg("projectId") projectId: number
  ) {
    try {
      const date = new Date().toString();

      await Tasks.insert({
        creator: creator,
        taskName: taskName,
        projectId: projectId,
        members: members,
        isComplete: false,
        created: date,
        completeDate: completeDate,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
