const axios = require('axios')
const { ApolloError } = require('apollo-server')
let redis = require('../redis')

const typeDefs = `
  extend type Query {
    tvs: [TV]
    tv(_id: String): TV
  }

  extend type Mutation {
    addTV (
      title: String,
      overview: String,
      poster_path: String,
      popularity: Float,
      tags: String
    ): TV

    updateTV (
      _id: String,
      title: String,
      overview: String,
      poster_path: String,
      popularity: Float,
      tags: String
    ): TV

    deleteTV (
      _id: String
    ): TV

  }

  type TV {
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
    tvs: async () => {
      try {
        let tvsCount = await redis.scard('tvsAllIds')
        if (tvsCount > 0) {
          const tvs = await redis.hvals('tvs')
          return tvs.map(JSON.parse)
        }
        const { data } = await axios.get('http://34.67.109.244/tvs')
        tvs = data.reduce((acc, tv) => {
          acc.push(tv._id, JSON.stringify(tv))
          return acc
        }, [])
        redis.hset('tvs', ...tvs)
        redis.expire('tvs', 60)

        redis.sadd('tvsAllId', tvs.map(tv => tv._id))
        redis.expire('tvsAllIds', 60)
        return data
      } catch (err) {
        if (err.name === 'Error') {
          throw new ApolloError(err.response.data.errors)
        }
        console.log(err, '<<<?>>>>')
        throw new ApolloError('Internal server error')
      }
    },
    tv: async (parent, args) => {
      try {
        let tv = await redis.hget('tvs', args._id)
        if (tv) {
          return JSON.parse(tv)
        }
        const { data } = await axios.get(`http://34.67.109.244/tvs/${args._id}`)
        await redis.hset('tvs', args._id, JSON.stringify(data))
        await redis.expire('tvs', 60)
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
    addTV: async (parent, args) => {
      try {
        const { data } = await axios.post(
          'http://34.67.109.244/tvs',
          {
            title: args.title,
            overview: args.overview,
            poster_path: args.poster_path,
            popularity: args.popularity,
            tags: args.tags
          }
        )
        redis.hset('tvs', data._id, JSON.stringify(data))
        return data
      } catch (err) {
        if (err.name === 'Error') {
          throw new ApolloError(err.response.data.errors)
        }
        console.log(err, '<<<')
        throw new ApolloError('Internal server error')
      }
    },
    updateTV: async (parent, args) => {
      try {
        const { data } = axios.patch(
          `http://34.67.109.244/tvs/${args._id}`,
          {
            title: args.title,
            overview: args.overview,
            poster_path: args.poster_path,
            popularity: args.popularity,
            tags: args.tags
          }
        )
        redis.hset('tvs', data._id, JSON.stringify(data))
        return data
      } catch (err) {
        if (err.name === 'Error') {
          throw new ApolloError(err.response.data.errors)
        }
        throw new ApolloError('Internal server error')
      }
    },
    deleteTV: async (parent, args) => {
      try {
        const { data } = axios.delete(`http://34.67.109.244/tvs/${args._id}`)
        redis.hdel('tvs', args._id)
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