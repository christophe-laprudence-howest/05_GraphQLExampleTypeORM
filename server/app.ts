import 'reflect-metadata'
import express, { Request, Response } from 'express'

import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions'
import { createConnection } from 'typeorm'
import { graphqlHTTP } from 'express-graphql'
import { GraphQLSchema } from 'graphql'
import cors from 'cors'

import { buildSchema } from 'type-graphql'
import { CourseResolver } from './resolvers/CourseResolver'
import { LecturerResolver } from './resolvers/LecturerResolver'

// APP SETUP
const app = express(),
  port = process.env.PORT || 8881

app.use(cors())

// MIDDLEWARE
app.use(express.json()) // for parsing application/json
;(async () => {
  // GET MONGO CONNECTED
  const conn: MongoConnectionOptions = {
    name: 'mongodb',
    type: 'mongodb',
    url: `mongodb+srv://<login>:<paswoord>@cluster0.lwymq.mongodb.net/<database>?retryWrites=true&w=majority`,
    useNewUrlParser: true,
    synchronize: true,
    logging: true,
    useUnifiedTopology: true,
    entities: [`${__dirname}/entities/*{.ts,.js}`],
    ssl: true,
  }

  await createConnection(conn).catch(ex => console.log(ex))

  // ROUTES
  app.get('/', (request: Request, response: Response) => {
    response.json({ welcome: 'just know: you matter!' })
  })

  /**
   *
   * @description create the graphql schema with the imported resolvers
   */
  let schema: GraphQLSchema = {} as GraphQLSchema

  await buildSchema({
    resolvers: [CourseResolver, LecturerResolver],
  }).then(_ => {
    schema = _
  })

  // GraphQL init middleware
  app.use(
    '/v1/', // Url, do you want to keep track of a version?
    graphqlHTTP((request, response) => ({
      schema: schema,
      context: { request, response },
      graphiql: true,
    })),
  )

  // APP START
  app.listen(port)
  console.info(`\nServer 👾 \nListening on http://localhost:${port}/v1/graphql`)
})()
