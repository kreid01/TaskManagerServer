import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import { DataSource } from "typeorm";
import { Users } from "./Entities/Users";
import { UserResolver } from "./UserResolver";
import { buildSchema } from "type-graphql/dist/utils";

const main = async () => {
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

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: await buildSchema({
        resolvers: [UserResolver],
      }),
      graphiql: true,
    })
  );

  app.listen(3001, () => {
    console.log("SERVER RUNNING PN PORT 3001");
  });
};

main().catch((err) => {
  console.log(err);
});
