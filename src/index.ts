import { ProjectResolver } from "./resolvers/projectRevolver";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import { createAccessToken, createRefreshToken } from "./utils/auth";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { DataSource } from "typeorm";
import { Users } from "./entitity/Users";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { json } from "body-parser";
import http from "http";
import { UserResolver } from "./resolvers/userResolvers";
import { TeamResolver } from "./resolvers/teamResolvers";
import { buildSchema } from "type-graphql";
import { Teams } from "./entitity/Teams";
import { Projects } from "./entitity/Projects";
import { Tasks } from "./entitity/Tasks";
import { TaskResolver } from "./resolvers/taskResolver";

const main = async () => {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieParser());
  const httpServer = http.createServer(app);

  app.get("/", (_req, res) => res.send(""));

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await Users.findOneBy({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  const connection = new DataSource({
    type: "mysql",
    host: "db",
    port: 3306,
    username: "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: "managementdb",
    logging: true,
    synchronize: false,
    entities: [Users, Teams, Projects, Tasks],
  });

  connection
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  interface MyContext {
    token?: String;
  }

  const server = new ApolloServer<MyContext>({
    schema: await buildSchema({
      resolvers: [UserResolver, TeamResolver, ProjectResolver, TaskResolver],
    }),
  });

  await server.start();

  app.use(
    "/graphql",
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    }),
    cors({
      origin: ["http://localhost:3000", "http://localhost:4000/graphql"],
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
};

main().catch((err) => {
  console.log(err);
});
