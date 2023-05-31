import express from 'express'
import cors from 'cors'
import logger from './logger.js'
import Person from './models/person.js'
// import data from './db.json' assert { type: "json" };

// i decided to use ES6 modules instead of CommonJS since node20 documentation
// calls it the official standart for this version being fully supported and stable now
// https://nodejs.org/api/esm.html

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(logger)

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has ${persons.length} contacts!</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(res => {
    if (res) {
      response.json(res)
    } else {
      response.status(404).send('error 404: not found')
    }
  })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204).send({ 204: 'no content' }))
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    response.status(400).json({
      error: 'content missing'
    })
  } else {
    const person = new Person({ ...response.req.body })
    person.save().then(res => {
      response.json(res)
    }).catch(err => next(err))
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true, context: 'query' })
    .then(res => {
      response.json(res)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'completely unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Express server running on ${PORT}`))