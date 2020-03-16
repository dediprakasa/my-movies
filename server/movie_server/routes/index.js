const express = require('express')
const router = express.Router()
const MovieController = require('../controllers')

router.post('/movies', MovieController.addMovie)
router.get('/movies/:movieId', MovieController.getMovieDetails)
router.get('/movies', MovieController.findAllMovies)
router.patch('/movies/:movieId', MovieController.updateMovie)
router.delete('/movies/:movieId', MovieController.deleteMovie)

module.exports = router