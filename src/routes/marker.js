const express = require('express')
const Query = require('../db/queries')

const router = require('express').Router();

router.get('/', (request, response) => {
  response.send('Hello')
})

router.get("/:id", (request, response) => {
  const ghost_id = request.params.id
  Query.findById(ghost_id).then((ghost) => response.status(200).send(ghost))
})

router.post("/", (request, response) => {
  console.log(request.body)
  Query.create(request.body).then(ghost => response.status(200).send(ghost))
})

module.exports = router
