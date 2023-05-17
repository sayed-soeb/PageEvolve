const express = require('express');
const path = require('path');
const port = 8000;
const app = express();
const mongoose = require('mongoose');
const shortid = require('shortid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));
db.once('open', function () {
  console.log('Connected to Database :: MongoDB');
});

// Define the schema
const contentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  urlId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

// Create a model based on the schema
const Content = mongoose.model('Content', contentSchema);

// Generate a unique URL ID
function generateUniqueUrlId() {
  return shortid.generate();
}

// Modify the route handler to return plain text response
app.post('/store-content', (req, res) => {
  const { content, title } = req.body;
  const urlId = generateUniqueUrlId();

  const newContent = new Content({
    content: content,
    urlId: urlId,
    title: title
  });

  newContent
    .save()
    .then(() => {
      console.log('Content stored successfully');
      res.send(urlId);
    })
    .catch((error) => {
      console.error('Error storing content:', error);
      res.status(500).send('Error storing content');
    });
});
// Assuming you have a route for deleting a title
app.post('/delete-title', (req, res) => {
  const { title } = req.body;
  
  // Perform the delete operation on MongoDB using your preferred method
  // For example, using Mongoose:
  Content.deleteOne({ title })
    .then(() => {
      res.json({ success: true, message: 'Title deleted successfully' });
    })
    .catch((error) => {
      console.error('Error deleting title:', error);
      res.json({ success: false, message: 'Failed to delete title' });
    });
});


app.get('/evolve/:title', (req, res) => {
  const title = req.params.title;

  Content.findOne({ title: title })
    .then((content) => {
      if (!content) {
        return res.status(404).send('Content not found');
      }

      res.render('evolve', { content });
    })
    .catch((error) => {
      console.error('Error retrieving content:', error);
      res.status(500).send('Error retrieving content');
    });
});




app.get('/get-titles', (req, res) => {
  Content.find({}, 'title')
    .then((contents) => {
      const titles = contents.map((content) => content.title);
      res.json(titles);
    })
    .catch((error) => {
      console.error('Error retrieving titles:', error);
      res.status(500).send('Error retrieving titles');
    });
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', require('./routes'));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
