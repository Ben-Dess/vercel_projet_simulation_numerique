import mongoose from 'mongoose';

let isConnected = false;

// Connection handler
async function connectDB() {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) throw new Error("Missing MONGODB_URI");

  const db = await mongoose.connect(mongoURI, {
    dbName: "Donjon"  // 👈 IMPORTANT !
  });

  isConnected = db.connections[0].readyState === 1;
}

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const Question = mongoose.models.Questions || mongoose.model("Questions", questionSchema);

// API Route
export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const questions = await Question.find({});
      return res.status(200).json(questions);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Error fetching questions" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
