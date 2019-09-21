import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import ProjectResolver from "./Project/Project.resolver";
import TaskResolver from "./Task/Task.resolver";
import UserResolver from "./User/User.resolver";
import TokenAPI from "./utils/TokenAPI";
import { UserModel } from "./User/User.model";
import { connect } from "mongoose";
import IContext from "./utils/IContext";


const PORT = 4000;

async function bootstrap() {
  await connect('mongodb://localhost/projects_list', {useNewUrlParser: true})

  const schema = await buildSchema({
    resolvers: [ProjectResolver, TaskResolver, UserResolver],
    authChecker: async ({context}: {context: IContext}, roles) => {
      const token = context.user.token
      const user: any = TokenAPI.verify(token)
      const isLoggedOut = await UserModel.findById(user.id).then(data => data.token !== token)
      context.user = user
      return !isLoggedOut
    }
  });
  
  const server = new ApolloServer({
    schema,
    context: ({ req }): IContext => {
      return {
        user: {
          id: null,
          role: null,
          token: TokenAPI.extract(req)
        }
      }
    },
    playground: true,
  });

  server.listen(PORT);
}

bootstrap()
.then(() => console.log(`Server is running, GraphQL Playground available`))
.catch((e) => console.log("server error", e))