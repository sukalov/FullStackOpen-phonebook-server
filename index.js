const express = require('express');
const cors = require('cors');
const app = express();
let persons = require('./db.json').persons;
console.log(persons)

app.use(cors());
app.use(express.json());


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
        response.status(404).end()
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
    const newContact = {
        ...response.req.body,
        id: Math.floor(Math.random() * 1000000)
    }
    persons = persons.concat(newContact)    
    response.json(newContact)
})

app.put('/api/persons/:id', (request, response) => {

    const index = persons.indexOf(persons.find(p => p.id === response.req.body.id))
    persons[index] = response.req.body;
    response.json(response.req.body)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`))