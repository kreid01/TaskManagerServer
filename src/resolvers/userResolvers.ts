import { MyContext } from "../interface/MyContext";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { isAuth } from "../utils/isAuth";
import { createRefreshToken, createAccessToken } from "../utils/auth";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Int,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { compare, hash } from "bcryptjs";
import { Users } from "../entitity/Users";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => Users)
  user: Users;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `your user id is: ${payload!.userId}`;
  }

  @Query(() => [Users])
  users() {
    return Users.find();
  }

  @Query(() => [Users])
  async searchUsers(@Arg("search") search: string) {
    const users = await Users.find();

    return await users.filter(
      (user) =>
        user.firstName.toLocaleLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLocaleLowerCase().includes(search.toLowerCase())
    );
  }

  @Query(() => Users, { nullable: true })
  async getUser(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return await Users.findOneById(payload.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(Users)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      throw new Error("could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("bad password");
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: number) {
    try {
      await Users.delete(id);
    } catch (err) {
      console.log(err);
    }
    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("username") username: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await Users.insert({
        email,
        password: hashedPassword,
        username: username,
        firstName: firstName,
        lastName: lastName,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
