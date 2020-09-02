const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI
console.log(url)
console.log(process.env.PORT)

  mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(error => {
    console.log("Error connecting to DB:", error);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact

if (process.argv.length === 3) {
    Contact.find({}).then(result => {
        result.forEach(contact => {
          console.log(contact)
        })
        mongoose.connection.close()
        process.exit(1)
      })
}

// const contact = new Contact({
//   name: name,
//   number: number
// })

// contact.save().then(result => {
//   console.log(`add ${contact.name} number ${contact.number} to phonebook` )
//   mongoose.connection.close()
// })


