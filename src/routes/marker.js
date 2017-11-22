const express = require('express')
const Query = require('../db/queries')

const router = require('express').Router();

router.get('/', (request, response) => {
  Query.findAll()
    .then((ghosts) => response.status(200).json(ghosts))
})

router.get('/geo', (request, response) => {
  const lat = request.query.lat
  const lng = request.query.lng
  Query.findByGeo(lat, lng)
    .then((ghosts) => response.status(200).json(ghosts))
})

router.get("/:id", (request, response) => {
  const ghost_id = request.params.id
  Query.findById(ghost_id)
    .then((ghost) => response.status(200).json(ghost))
})

router.post("/", (request, response) => {
  console.log(request.body)
  Query.create(request.body)
    .then(ghost => response.status(200).json(ghost))
})

module.exports = router
