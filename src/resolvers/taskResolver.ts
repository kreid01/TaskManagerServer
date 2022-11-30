import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Tasks } from "../entitity/Tasks";
import { Teams } from "../entitity/Teams";

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
  async getTeamTasks(@Arg("id") id: number) {
    const tasks = await Tasks.find();

    const teamTasks = tasks.filter((task) => task.teamId === id);

    return teamTasks;
  }

  @Query(() => [Tasks])
  async getUsersTasks(@Arg("id") userId: number) {
    const teams = await Teams.find();
    const usersTeams = teams.map((team) => {
      if (
        team.teamLead === userId ||
        team.members.includes(userId.toString())
      ) {
        return team;
      }
    });

    const tasks = await Tasks.find();

    const usersTasks = tasks.map((task) => {
      if (usersTeams.filter((team) => team?.id === task.teamId)) return task;
    });

    return usersTasks;
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
  async deleteTeamTasks(@Arg("id") teamId: number) {
    const tasks = await Tasks.find();

    await tasks.map(async (task) => {
      if (task.teamId === teamId) {
        await Tasks.delete({ id: task.id });
      }
    });

    return true;
  }

  @Mutation(() => Boolean)
  async createTask(
    @Arg("creator") creator: number,
    @Arg("taskName") taskName: string,
    @Arg("completeDate") completeDate: string,
    @Arg("teamId") teamId: number,
    @Arg("projectId") projectId: number
  ) {
    try {
      const date = new Date().toString();

      await Tasks.insert({
        creator: creator,
        taskName: taskName,
        teamId: teamId,
        projectId: projectId,
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
