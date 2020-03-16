const axios = require('axios')
const { ApolloError } = require('apollo-server')
let redis = require('../redis')

const typeDefs = `
  extend type Query {
    movies: [Movie]
    movie(_id: String): Movie
  }

  extend type Mutation {
    addMovie (
      title: String,
      overview: String,
      poster_path: String,
      popularity: Float,
      tags: String
    ): Movie

    updateMovie (
      _id: String,
      title: String,
      overview: String,
      poster_path: String,
      popularity: Float,
      tags: String
    ): Movie

    deleteMovie (
      _id: String
    ): Movie

  }

  type Movie {
    _id: String
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }
`

const resolvers = {
  Query: {
    movies: async () => {
      try {
        let moviesCount = await redis.scard('moviesAllIds')
        if (moviesCount > 0) {
          const movies = await redis.hvals('movies')
          return movies.map(JSON.parse)
        }
        const { data } = await axios.get('http://34.67.109.244/movies')
        movies = data.reduce((acc, movie) => {
          acc.push(movie._id, JSON.stringify(movie))
          return acc
        }, [])
        redis.hset('movies', ...movies)
        redis.expire('movies', 60)

        redis.sadd('moviesAllId', movies.map(movie => movie._id))
        redis.expire('moviesAllIds', 60)
        return data
      } catch (err) {
        if (err.name === 'Error') {
          throw new ApolloError(err.response.data.errors)
        }
        throw new ApolloError('Internal server error')
      }
    },
    movie: async (parent, args) => {
      try {
        let movie = await redis.hget('movies', args._id)
        if (movie) {
          return JSON.parse(movie)
        }
        const { data } = await axios.get(`http://34.67.109.244/movies/${args._id}`)
        await redis.hset('movies', args._id, JSON.stringify(data))
        await redis.expire('movies', 60)
        return data
      } catch (err)  {
        if (err.name === 'Error') {
          throw new ApolloError(err.response.data.errors)
        }
        throw new ApolloError('Internal server error')
      }
    }
  },
  Mutation: {
    addMovie: async (parent, args) => {
      try {
        console.log('!!!!!')
        const { data } = await axios.post(
          'http://34.67.109.244/movies',
          {
            title: args.title,
            overview: args.overview,
            poster_path: args.poster_path,
            popularity: args.popularity,
            tags: args.tags
          }
        )
        redis.hset('movies', data._id, JSON.stringify(data))
        return data
      } catch (err) {
        if (err.name === 'Error') {
          console.log(err, '{{')
          throw new ApolloError(err.response.data.errors)
        }
        console.log(err, '<<<')
        throw new ApolloError('Internal server error')
      }
    },
    updateMovie: async (parent, args) => {
      try {
        const { data } = axios.patch(
          `http://34.67.109.244/movies/${args._id}`,
          {
            title: args.title,
            overview: args.overview,
            poster_path: args.poster_path,
            popularity: args.popularity,
            tags: args.tags
          }
        )
        redis.hset('movies', data._id, JSON.stringify(data))
        return data
      } catch (err) {
        if (err.name === 'Error') {
          throw new ApolloError(err.response.data.errors)
        }
        console.log(err, '<<<<')
        throw new ApolloError('Internal server error')
      }
    },
    deleteMovie: async (parent, args) => {
      try {
        const { data } = axios.delete(`http://34.67.109.244/movies/${args._id}`)
        redis.hdel('movies', args._id)
        return data
      } catch (err) {
        if (err.name === 'Error') {
          throw new ApolloError(err.response.data.errors)
        }
        throw new ApolloError('Internal server error')
      }
    }
  }
}

module.exports = {
  typeDefs, resolvers
}