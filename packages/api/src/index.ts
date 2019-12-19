import { GraphQLServer } from 'graphql-yoga'
import message from './message'

const typeDefs = `
  type Query {
    greeting: String
  }
`

const resolvers = {
  Query: {
    greeting: message,
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => console.log(`Server is running at http://localhost:4000`))
