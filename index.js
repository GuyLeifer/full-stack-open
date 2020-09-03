const Contact = require('./mongo') 
require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.static('./build'))
app.use(express.json())

const cors = require('cors')
app.use(cors())

const mongoose = require('mongoose')

  const morgan = require('morgan')
  morgan.token('post', function(req, res) {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    } else {
      return " ";
    }
  })



// app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) {
    console.log(tokens.method(req, res)),
    console.log(tokens.url(req, res)),
    console.log(tokens.status(req, res)),
    console.log(tokens.res(req, res, 'content-length'), '-'),
    console.log(tokens['response-time'](req, res), 'ms'),
    console.log(tokens['post', (req, res)])
  }))


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
    },
  ]

app.get('/', (req, res) => {
  res.send('Welcome To Local Host Port 3001!')
})

app.get('/info', (req, res) => {
    const p = `Phonebook has info for ${Contact.length} people`;
    const date = new Date();
    res.send(p + " " + date)
})

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(result => {
    res.json(result)
    mongoose.connection.close()
  })
})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    response.status(500).end()
  })
})


app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Contact.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  
  // const generateId = () => {
  //   const maxId = persons.length > 0
  //     ? Math.max(...persons.map(n => n.id))
  //     : 0
  //   return maxId + 1
  // }

  const checkGetPostBody = (req, res) => {
    const body = req.body
    if (!body.name) {
      return res.status(400).json({ error: 'the name field is missing' })
    }
    if (!body.number) {
      return res.status(400).json({ error: 'the number field is missing' })
    }
    return body
  }
  
  app.post('/api/persons', (req, res, next) => {
    const body = checkGetPostBody(req, res)
    // if (persons.find(i => i.name === body.name)) {
    //   return res.status(400).json({ error: "the name must be unique" });
    // }
    const person = new Contact({
      name: body.name,
      number: body.number
    })
    person
      .save()
      .then(newPerson => {
        res.json(newPerson.toJSON())
      })
      .catch(error => next(error))
  })
  
  const errorHandler = (error, request, response, next) => {
    console.log(error)
  
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ error: 'malformed id' })
    }
  
    if (error.name === 'ValidationError') {
      return response.status(400).send({ error: error.message })
    }
  
    next(error)
  }
  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 