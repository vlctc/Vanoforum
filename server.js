const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

const MONGO_URI = 'mongodb+srv://vmahomedov:U6k7ORmehRy8OJuE@cluster0.qbdv9k1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const articleSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vanoforum.html'));
});


app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});


app.post('/api/articles', async (req, res) => {
  const { username, title, content } = req.body;

  if (!username || !title || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newArticle = new Article({ username, title, content });
    await newArticle.save();
    res.status(201).json({ message: 'Article saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save article' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});