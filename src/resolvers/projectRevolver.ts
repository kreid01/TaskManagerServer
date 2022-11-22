import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Projects } from "../entitity/Projects";
import { Teams } from "../entitity/Teams";

@Resolver()
export class ProjectResolver {
  @Mutation(() => Boolean)
  async deleteProject(@Arg("id") id: number) {
    try {
      await Projects.delete(id);
    } catch (err) {
      console.log(err);
    }
    return true;
  }

  @Query(() => [Projects])
  getProjects() {
    return Projects.find();
  }

  @Query(() => Projects)
  async getProject(@Arg("id") id: number) {
    return await Projects.findOneById(id);
  }

  @Mutation(() => Projects)
  async updateProject(@Arg("id") id: number, @Arg("tasks") teams: string) {
    const team = await Projects.findOneBy({ id: id });

    await Projects.update({ id: id }, { teams: teams });

    return team;
  }

  @Query(() => [Projects])
  async getUsersProjects(@Arg("id") userId: number) {
    const teams = await Teams.find();
    const usersTeams = teams.map((team) => {
      if (team.members.includes(userId.toString())) return team;
    });

    const projects = await Projects.find();

    const usersProjects = projects.map((project) => {
      if (
        project.projectLead === userId ||
        teams.some((team) => team.members.includes(userId.toString()))
      )
        return project;
    });

    return usersProjects;
  }

  @Mutation(() => Boolean)
  async createProject(
    @Arg("projectLead") projectLead: number,
    @Arg("projectName") projectName: string,
    @Arg("teams") teams: string
  ) {
    try {
      const date = new Date().toString();

      await Projects.insert({
        projectLead: projectLead,
        projectName: projectName,
        teams: teams,
        created: date,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
