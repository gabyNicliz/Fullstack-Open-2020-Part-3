/* eslint-env node, es6 */

const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

const cors = require('cors')

app.use(express.static('build'))

app.use(cors())

const morgan = require('morgan')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(' :method :url :status :response-time ms - :res[content-length] :body'))

app.use(express.json())

// get all persons from the the phonebook's database
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

// get a particular person based on their id the phonebook's database
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// show how many persons are in the phonebook's database
app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => {
    const numberOfPersons = persons.length
    const date = new Date()
    response.send(`Phonebook has info for ${numberOfPersons} people\n${date}`)
  })
})

// delete person from the phonebook's database
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// post new person's info on the phonebook's database
app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))

  app.use(morgan(' :method :url :status :response-time ms - :res[content-length] :body'))
})

// update person's number from the phonebook's database
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
  .then(updatedPerson => {
    response.json(updatedPerson.toJSON())
  })
  .catch(error => next(error))
})

const generateId = () => {
  const min = persons.length
  const max = 10000
  return Math.trunc(Math.random() * (max - min) + min)
}


const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})