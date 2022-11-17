import express from "express";
import cors from "cors";
import { UserResolver } from "./UserResolver";
import { buildSchema } from "type-graphql/dist/utils";
import { ApolloServer } from "apollo-server-express";
import { DataSource } from "typeorm";
import { Users } from "./entitity/Users";
import "dotenv/config";

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/", (req, res) => res.send(""));

  const connection = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "kiki8kiki8",
    database: "managementdb",
    logging: true,
    synchronize: false,
    entities: [Users],
  });

  connection
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  await app.listen(3001, () => {
    console.log("SERVER RUNNING PN PORT 3001");
  });
};

main().catch((err) => {
  console.log(err);
});
