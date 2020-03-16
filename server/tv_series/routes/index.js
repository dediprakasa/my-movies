const express = require('express')
const router = express.Router()
const TVController = require('../controllers')

router.post('/tvs', TVController.addTV)
router.get('/tvs/:tvId', TVController.getTVDetails)
router.get('/tvs', TVController.findAllTVs)
router.patch('/tvs/:tvId', TVController.updateTV)
router.delete('/tvs/:tvId', TVController.deleteTV)

module.exports = router