const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const redis = require('redis');
const redisClient = redis.createClient({
  url: 'redis://redis-service:6379',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

mongoose.connect('mongodb://mongodb-service:27017/opikaDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User'); // Import the User model from User.js

// Middleware to parse JSON data
app.use(express.json());

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// POST a new user
// POST a new user
app.post('/api/users', async (req, res) => {
  const { email } = req.body; // Extract email from the request body

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // If no existing user, proceed to create a new user
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});


// GET a user by ID
app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Check Redis cache first
    const cacheUser = await redisClient.get(id);
    if (cacheUser) {
      console.log("redis cache mil gaya");
      return res.json(JSON.parse(cacheUser));
    }

    // If not in cache, query MongoDB
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Store user data in Redis cache
    await redisClient.set(id, JSON.stringify(user));

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});


// PUT (update) a user by ID
app.put('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Error updating user' });
  }
});

// DELETE a user by ID
app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
      const result = await User.findOneAndDelete({ _id: id });
      console.log(result);
      res.json(result);
  } catch (error) {
    res.status(400).json({ error: `Error deleting user ${error}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
