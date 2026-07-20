import mongoose from 'mongoose'
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB>phonebook database')
  })
  .catch(() => console.log('error connecting to MongoDB'))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (number) {
        let numbers = '1234567890-'
        for (let i = 0; i < number.length; i++) {
          if (numbers.includes(number[i]) === false) {
            return false
          }
        }
        if (
          number.split('-')[0].length < 2 ||
          number.split('-')[0].length > 3
        ) {
          return false
        }
        return true
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
    required: [true, 'User phone number is required'],
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model('Person', personSchema)
