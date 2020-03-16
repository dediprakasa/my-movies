const Movie = require('../models/Movie')
const { tagFormatter } = require('../helpers/tagFormatter')

class MovieController {

  static addMovie(req, res, next) {
    const { title, overview, poster_path, popularity } = req.body
    let tags = tagFormatter(req.body.tags)
    Movie.create({
      title,
      overview,
      poster_path,
      popularity,
      tags
    })
      .then(movie => {
        res.status(201).json(movie)
      })
      .catch(next)
  }

  static findAllMovies(req, res, next) {
    let query = {}
    if (req.query.tag) {
      query = { tags: { $elemMatch: { $regex: req.query.tag, $options: 'i' }}}
    } else {
      let q = req.query.q || ''
      query = {
        $or: [
          { title: { $regex: q, $options: 'i' }},
          { tags: { $elemMatch: { $regex: q, $options: 'i' }}}
        ]
      }
    }
    Movie.find(query)
      .sort({ createdAt: -1 })
      .then(movies => {
        res.status(200).json(movies)
      })
      .catch(next)
  }

  static getMovieDetails(req, res, next) {
    Movie.findById(req.params.movieId)
      .then(movie => {
        if (movie) {
          res.status(200).json(movie)
        } else {
          next({ statusCode: 404, message: 'Movie not found' })
        }
      })
      .catch(next)
  }

  static updateMovie(req, res, next) {
    const { title, overview, poster_path, popularity, tags } = req.body
    const update = {}
    title && (update.title = title)
    overview && (update.overview = overview)
    poster_path && (update.poster_path = poster_path)
    popularity && (update.popularity = popularity)
    poster_path && (update.poster_path = poster_path)
    tags ? (update.tags = tagFormatter(tags)) : (update.tags = [])
    Movie.findByIdAndUpdate(req.params.movieId,
      update,
      { new: true, omitUndefined: true })
      .then(movie => {
        res.status(200).json(movie)
      })
      .catch(next)
  }

  static deleteMovie(req, res, next) {
    Movie.findByIdAndDelete(req.params.movieId)
      .then(movie => {
        if (movie) {
          res.status(200).json({
            message: 'Successfully deleted'
          })
        } else {
          next({ statusCode: 404, message: 'Movie not found' })
        }
      })
      .catch(next)
  }
}

module.exports = MovieController