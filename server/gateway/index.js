const { ApolloServer, makeExecutableSchema } = require('apollo-server');

const movie = require('./schemas/movie')
const tv = require('./schemas/tv')

const typeDefs = `
  type Query
  type Mutation
`
const schema = makeExecutableSchema({
  typeDefs: [typeDefs, movie.typeDefs, tv.typeDefs],
  resolvers: [movie.resolvers, tv.resolvers]
})

const server = new ApolloServer({ schema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});