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

const User = require('./models/User'); 

app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});


app.post('/api/users', async (req, res) => {
  const { email } = req.body; 

  try {
    // Checking if a user with the given email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});


app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Checking Redis cache first
    const cacheUser = await redisClient.get(id);
    if (cacheUser) {
      return res.json(JSON.parse(cacheUser));
    }

    // If not in cache, query MongoDB
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await redisClient.set(id, JSON.stringify(user)); // adding data to Redis cache

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});


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

app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await User.findOneAndDelete({ _id: id });
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    await redisClient.del(id);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: `Error deleting user: ${error}` });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
