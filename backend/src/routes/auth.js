const express = require('express');
const { PrismaClient } = require('@prisma/client');

const authenticate = require '../middleware/authMiddleware.js'
const { generateToken, hashPassword, comparePassword } = require('../utils/jwt.js');
const { userSchema } = require('../validator/schemas.js');

const prisma = new PrismaClient();
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {

  // Validate entries
  const {error, value} = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  };
  const { username, password } = value;

  // Proceed if validation passes
  try {
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: 'User registered successfully', user });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Login a user
router.post('/login', async (req, res) => {

  // Validate entries
  const {error, value} = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message});
  };
  const { username, password } = value;

  // Proceed if validation passes
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    // Compare passwords
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    // Generate a JWT token
    const token = generateToken(user.id);
    return res.json({ token });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// verify token
router.get('/verify', authenticate,  async (req, res) => {

  // if valid token, return success
  return res.status(200).json({
    valid: true,
    userId: res.userId
  });
});


module.exports = router;
