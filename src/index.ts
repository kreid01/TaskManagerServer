import { ProjectResolver } from "./resolvers/projectRevolver";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { DataSource } from "typeorm";
import { Users } from "./entitity/Users";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import http from "http";
import { UserResolver } from "./resolvers/userResolvers";
import { buildSchema } from "type-graphql";
import { Projects } from "./entitity/Projects";
import { Tasks } from "./entitity/Tasks";
import { TaskResolver } from "./resolvers/taskResolver";
import { authController } from "./controllers/atuhController";

const main = async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  const httpServer = http.createServer(app);
  app.get("/", (_req, res) => res.send(""));

  const connection = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "kiki8kiki8",
    database: "managementdb",
    logging: true,
    synchronize: true,
    entities: [Users, Projects, Tasks],
  });

  await connection
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
      resolvers: [UserResolver, ProjectResolver, TaskResolver],
    }),
  });

  await server.start();
  app.use(
    "/graphql",
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  app.use("/refresh_token", authController);
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
};

main().catch((err) => {
  console.log(err);
});
