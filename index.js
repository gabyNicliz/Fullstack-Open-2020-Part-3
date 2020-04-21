const express = require('express')
const app = express()

const cors = require('cors')

app.use(express.static('build'))

app.use(cors())

const morgan = require('morgan')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(' :method :url :status :response-time ms - :res[content-length] :body'))

app.use(express.json())

let persons = [
  {
    name: "Arto Hellas",
      number: "040-123456",
      id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  console.log(person)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/api/info', (request, response) => {
  const numberOfPersons = persons.length
  const date = new Date()
  response.send(`Phonebook has info for ${numberOfPersons} people\n${date}`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  for (let i = 0; i < persons.length; i++) {
    if (persons[i].name === body.name) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId()
  }

  persons = persons.concat(person)
  app.use(morgan(' :method :url :status :response-time ms - :res[content-length] :body'))
  response.json(person)
})

const generateId = () => {
  const min = persons.length
  const max = 10000
  return Math.trunc(Math.random() * (max - min) + min)
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})