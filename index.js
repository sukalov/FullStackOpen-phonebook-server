import express from 'express';
import cors from 'cors';
import data from './db.json' assert { type: "json" };
import logger from './logger.js';

// i decided to use ES6 modules instead of CommonJS since node20 documentation
// calls it the official standart for this version being fully supported and stable now
// https://nodejs.org/api/esm.html

let persons = data.persons;
const app = express();

app.use(express.static('build'))
app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has ${persons.length} contacts!</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const result = persons.find(p => p.id === Number(request.params.id))
    if (result) {
        response.json(result)
    } else {
        response.status(404).send({ error: 'unknown endpoint' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const filter = persons.find(person => person.id === id)
    persons = persons.filter(person => person !== filter)
    if (filter) {
        response.status(204).end()
    } else {
        response.status(404).send({ error: 'unknown endpoint' })
    }
})

app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        response.status(400).json({ 
            error: 'content missing' 
          })
    } else if (persons.find(p => p.name == request.body.name)) {
        response.status(400).json({ 
            error: 'name must be unique' 
          })
    } else {
        const newContact = {
            ...response.req.body,
            id: Math.floor(Math.random() * 10000000)
        }
        persons = persons.concat(newContact)    
        response.json(newContact)
    }
})

app.put('/api/persons/:id', (request, response) => {

    const index = persons.indexOf(persons.find(p => p.id === response.req.body.id))
    persons[index] = response.req.body;
    response.json(response.req.body)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'completely unknown endpoint' })
  }
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Express server running on ${PORT}`))