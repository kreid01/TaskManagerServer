import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Projects } from "../entitity/Projects";

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
  async updateProjectMembers(
    @Arg("id") id: number,
    @Arg("members") members: string
  ) {
    const team = await Projects.findOneBy({ id: id });

    await Projects.update({ id: id }, { members: members });

    return team;
  }

  @Query(() => [Projects])
  async getUsersProjects(@Arg("id") userId: number) {
    const projects = await Projects.find();

    const userProjects = projects.filter(
      (project) =>
        project.members.includes(userId.toString()) ||
        project.projectLead === userId
    );
    return userProjects;
  }

  @Query(() => [Projects])
  async searchProjects(@Arg("search") search: string) {
    const projects = await Projects.find();

    const searchedProjects = projects.filter((project) =>
      project.projectName.toLowerCase().includes(search.toLowerCase())
    );

    return searchedProjects;
  }

  @Mutation(() => Boolean)
  async createProject(
    @Arg("projectLead") projectLead: number,
    @Arg("projectName") projectName: string,
    @Arg("members") members: string,
    @Arg("completeDate") completeDate: string
  ) {
    try {
      const date = new Date().toString();

      await Projects.insert({
        projectLead: projectLead,
        projectName: projectName,
        members: members,
        completeDate: completeDate,
        isComplete: false,
        created: date,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
