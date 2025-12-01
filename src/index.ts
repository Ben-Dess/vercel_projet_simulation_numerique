import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from "bcryptjs"
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || ''

if (!mongoose.connection.readyState) {
  await mongoose.connect(mongoURI)
  console.log('Connected to MongoDB')
}

export const collections: { Questions?: mongoDB.Collection } = {}

export async function connectToDatabase () {

   const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGODB_URI);
           
   await client.connect();
       
   const db: mongoDB.Db = client.db("Donjon");
  
   const gamesCollection: mongoDB.Collection = db.collection("Questions");

 collections.Questions = gamesCollection;
      
        console.log(`Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}`);
}
// User schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
})

// Remove password from JSON responses
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    return ret
  },
})

const Question = mongoose.model('Questions', userSchema)

// // POST /users → add new user
// app.post('/users', async (req, res) => {
//   try {
//     const { name, email, password } = req.body

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'name, email, and password are required' })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     })

//     await newUser.save()

//     const userWithoutPassword = newUser.toJSON()
//     res.status(201).json({ message: 'User added successfully', user: userWithoutPassword })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: 'Failed to add user' })
//   }
// })

// GET /users → fetch all users (without passwords)
app.get('/questions', async (req, res) => {
  try {
    const users = await Question.find({})
    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

export default app
