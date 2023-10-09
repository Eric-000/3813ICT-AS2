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

  const userWithExtraInfo = await User.findById(user._id)
      .populate('roles')
      .populate({
        path: 'groups',
        populate: {
            path: 'channels'
        }
      });


  // generate jwt
  const token = jwt.sign({ id: user.id }, 'secretKey', {
    expiresIn: '1h',
  });

  const userObj = userWithExtraInfo.toObject();
  delete userObj.password;

  res.status(201).send({
    token,
    user: userWithExtraInfo
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  // check user existed
  const user = await User.findOne({ username })
    .populate('roles')
    .populate({
      path: 'groups',
      populate: {
        path: 'channels'
      }
  });
  
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
    expiresIn: '10h',
  });

  const userObj = user.toObject();
  delete userObj.password;
  
  res.status(200).send({
    token,
    user: userObj
  });
};

const getUsers = async (req, res) => {
  try {
    const userRole = await Role.findOne({ name: 'User' });
    if (!userRole) {
      return res.status(400).send('User role not found.');
    }

    const users = await User.find({ roles: userRole._id })
                            .select('-password');
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


module.exports = {
  register,
  login,
  getUsers
};
