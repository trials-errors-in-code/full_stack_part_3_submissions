import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('give password as an argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb://fso_db_user:${password}@ac-kpdoe2o-shard-00-00.szndsaz.mongodb.net:27017,ac-kpdoe2o-shard-00-01.szndsaz.mongodb.net:27017,ac-kpdoe2o-shard-00-02.szndsaz.mongodb.net:27017/phoneBook?ssl=true&replicaSet=atlas-y01u6n-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length !== 5) {
  Person.find({}).then((persons) => {
    persons.forEach((person) => console.log(person.name, person.number))
    mongoose.connection.close()
  })
} else {
  let name = process.argv[3]
  let number = process.argv[4]

  let person = new Person({
    name: name,
    number: number,
  })
  person.save().then((res) => {
    console.log(`added ${res.name} number ${res.number} to phonebook`)
    mongoose.connection.close()
  })
}
