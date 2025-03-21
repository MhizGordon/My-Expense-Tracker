const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Registration endpoint: POST /api/v1/login/register
router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Ensure passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Check for an existing user with the same email.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }

    // Confirm that password is defined
    if(!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    // Hash the password with defined salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance and save it to the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Wrong email or password' });
      }
  
      // Compare password using bcrypt
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Wrong email or password' });
      }
  
      // Generate a JWT token (using an environment variable for the secret in production)
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );
  
      // Respond with the token and user info (excluding sensitive data)
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error during login.' });
    }
  });
  
 
module.exports = router;
