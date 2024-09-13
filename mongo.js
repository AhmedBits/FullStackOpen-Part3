const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give the password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://easycs50:${password}@cluster0.ayypg.mongodb.net/phonebookApp?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log(
    `Usage:
    View all numbers: node mongo.db yourpassword
    Add a new number: node mongo.db yourpassword name number`
  )
  process.exit(1)
}