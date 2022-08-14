const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 30,
    required: true
  },
  number: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Loran',
  number: '0079-2000',
  date: new Date()
})

if (false) {
    person.save().then(results => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}

Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
})