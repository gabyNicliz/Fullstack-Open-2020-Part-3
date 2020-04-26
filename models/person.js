/* eslint-env node, es6 */

const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useCreateIndex', true);

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', console.log(error))
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: (number) => {
          return isValidNumber(number)
        }}
    }
  })

  // has to have at least 8 digits
  const isValidNumber = (number) => {
    const numbers = number.replace(/\D/g, '')

    return numbers.length >= 8
  }

  personSchema.plugin(uniqueValidator)

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)
