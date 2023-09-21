const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const Role = require('../models/roleModel');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, password, email } = req.body;

  // check user existed
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    if(existingUser.username === username) {
      return res.status(400).send('Username already exists.');
    }
    if(existingUser.email === email) {
      return res.status(400).send('Email already exists.');
    }
  }

  // find the "User" role
  const userRole = await Role.findOne({ name: 'User' });
  if (!userRole) {
    return res.status(500).send('User role not found.');
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 8);

  // create a new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
    roles: [userRole._id],
  });

  await user.save();

  // generate jwt
  const token = jwt.sign({ id: user.id }, 'secretKey', {
    expiresIn: '1h',
  });

  res.status(201).send({ token });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  // check user existed
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send('User not found.');
  }

  // check password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).send('Invalid credentials.');
  }

  // generate jwt
  const token = jwt.sign({ id: user.id }, 'secretKey', {
    expiresIn: '1h',
  });

  res.status(200).send({ token });
};

module.exports = {
  register,
  login,
};
