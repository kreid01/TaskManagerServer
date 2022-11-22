import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Teams } from "../entitity/Teams";

@Resolver()
export class TeamResolver {
  @Mutation(() => Boolean)
  async deleteTeam(@Arg("id") id: number) {
    try {
      await Teams.delete(id);
    } catch (err) {
      console.log(err);
    }
    return true;
  }

  @Query(() => [Teams])
  teams() {
    return Teams.find();
  }

  @Query(() => Teams)
  async getTeam(@Arg("id") id: number) {
    return await Teams.findOneById(id);
  }

  @Query(() => [Teams])
  async getUsersTeams(@Arg("id") userId: number) {
    const teams = await Teams.find();
    const teamsNew = teams.map((team) => {
      if (team.teamLead === userId || team.members.includes(userId.toString()))
        return team;
    });

    return teamsNew;
  }

  @Mutation(() => Teams)
  async updateTeam(@Arg("id") id: number, @Arg("members") members: string) {
    const team = await Teams.findOneBy({ id: id });

    await Teams.update({ id: id }, { members: members });

    return team;
  }

  @Mutation(() => Boolean)
  async createTeam(
    @Arg("teamLead") teamLead: number,
    @Arg("teamName") teamName: string,
    @Arg("members") members: string
  ) {
    try {
      const date = new Date().toString();

      await Teams.insert({
        teamLead: teamLead,
        teamName: teamName,
        members: members,
        created: date,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
