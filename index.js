const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))
app.use(cors())

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456",
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523",
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345",
    },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
    }
]

const generateId = () => {

    let max = 1000

    let randomId = Math.floor(Math.random() * max);

    return randomId
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let length = persons.length

    date = new Date()

    response.send(`<p>Phonebook has info for ${length} people</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.number) {
        return response.status(404).json({
            error: 'Number is missing'
        })
    } else if (!body.name) {
        return response.status(404).json({
            error: 'Name is missing'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
        date: new Date(),
    }

    const sameId = persons.filter(p => p.id === person.id)
    const sameName = persons.filter(p => p.name.toLowerCase() === person.name.toLowerCase())


    if (sameId.length > 0) {
        return response.status(404).json({
            error: 'The id is already taken. Try again'
        })
    } else if (sameName.length > 0) {
        return response.status(404).json({  
            error: 'The name is already taken.'
        })
    }
    
    persons = persons.concat(person)
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})