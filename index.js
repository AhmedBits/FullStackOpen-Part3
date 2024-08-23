const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')
const app = express()

dotenv.config()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :type'
))

morgan.token('type', (request, response) => {
  return JSON.stringify(request.body)
})

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const text = `Phonebook has info for ${persons.length} people`
  const date = new Date().toString()

  response.send(`${text}<br>${date}`)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Must include a name and number'
    })
  }

  const matchingName = persons.filter(p => p.name === body.name)

  if (matchingName.length > 0) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const newPerson = {
    id: `${generateId()}`,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 100000) // 100k
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})