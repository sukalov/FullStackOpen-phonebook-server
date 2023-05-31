import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const url =process.env.MONGO_URL

mongoose.set('strictQuery', false)

console.log('connecting to', url)
mongoose.connect(url)
  .then(console.log('connected to MongoDB'))
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('person', personSchema)

export default Person