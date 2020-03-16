const { Schema, model } = require('mongoose')

const tvSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title must be filled out']
  },
  overview: {
    type: String,
    required: [true, 'Overview must be filled out']
  },
  poster_path: {
    type: String,
    required: [true, 'Poster path must be filled out']
  },
  popularity: {
    type: Number,
    required: [true, 'Popularity must be filled out']
  },
  tags: {
    type: [String]
  }
})

const TV = model('TV', tvSchema)

module.exports = TV