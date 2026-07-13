import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import Person from './models/person.js'

const app = express()
app.use(express.json())

morgan.token('post', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return null
})

app.use(express.static('dist'))
app.use(morgan(':method :post'))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`)
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch(() => next('server error'))
})
app.get('/info', (req, res, next) => {
  Person.find({})
    .then((persons) =>
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p> <br><br><p>${new Date()}</p>`,
      ),
    )
    .catch(() => next('server error'))
})
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((deletedNote) => {
      {
        console.log('deleted the note', deletedNote)
        res.status(204).end()
      }
    })
    .catch(() => next('server error'))
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    let error = 'post error'
    next(error)
    return
  }
  let person = {
    name: req.body.name,
    number: req.body.number,
  }
  Person.create(person)
    .then((person) => res.json(person))
    .catch((error) => {
      next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        next('Person not found')
        return
      }
      person.name = name
      person.number = number
      person.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch(() => next('server error'))
})

const unknownEndpoint = (req, res, next) => {
  let error = 'endpoint error'
  next(error)
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res) => {
  console.log('Error:', error.message || error)
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'ValidationError' })
  } else if (error === 'endpoint error') {
    return res.status(404).send({ error: 'unknown endpoint' })
  } else if (error === 'post error') {
    return res.status(400).json({ error: 'Either name or number missing' })
  } else if (error === 'server error') {
    return res.status(500).json({ error: 'Internal server error' })
  } else if (error === 'Person not found') {
    return res.status(404).send({ error: 'Not found' })
  } else return res.status(500).json({ error: 'Internal server error' })
}
app.use(errorHandler)
