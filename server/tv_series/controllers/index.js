const TV = require('../models/TV')
const { tagFormatter } = require('../helpers/tagFormatter')

class TVController {

  static addTV(req, res, next) {
    const { title, overview, poster_path, popularity } = req.body
    let tags = tagFormatter(req.body.tags)
    TV.create({
      title,
      overview,
      poster_path,
      popularity,
      tags
    })
    .then(TV => {
      res.status(201).json(TV)
    })
    .catch(next)
  }
  
  static findAllTVs(req, res, next) {
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
    TV.find(query)
      .sort({ createdAt: -1 })
      .then(tvs => {
        res.status(200).json(tvs)
      })
      .catch(next)
  }

  static getTVDetails(req, res, next) {
    TV.findById(req.params.tvId)
      .then(tv => {
        if (tv) {
          res.status(200).json(tv)
        } else {
          next({ statusCode: 404, message: 'TV not found' })
        }
      })
      .catch(next)
  }

  static updateTV(req, res, next) {
    const { title, overview, poster_path, popularity, tags } = req.body
    const update = {}
    title && (update.title = title)
    overview && (update.overview = overview)
    poster_path && (update.poster_path = poster_path)
    popularity && (update.popularity = popularity)
    poster_path && (update.poster_path = poster_path)
    tags ? (update.tags = tagFormatter(tags)) : (update.tags = [])
    TV.findByIdAndUpdate(req.params.tvId,
      update,
      { new: true, omitUndefined: true })
      .then(tv => {
        res.status(200).json(tv)
      })
      .catch(next)
  }

  static deleteTV(req, res, next) {
    TV.findByIdAndDelete(req.params.tvId)
      .then(TV => {
        if (TV) {
          res.status(200).json({
            message: 'Successfully deleted'
          })
        } else {
          next({ statusCode: 404, message: 'TV not found' })
        }
      })
      .catch(next)
  }
}

module.exports = TVController