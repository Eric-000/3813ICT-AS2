const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const Role = require('../models/roleModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

const uploadProfileImage = async (req, res) => {
  try {
    // get user
    const user = await User.findById(req.user._id);
    // Check if user has an existing profile image
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage);
      
      // Check if old image file exists, then delete
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.profileImage = path.join('uploads', req.file.filename);
    await user.save();
    res.status(200).send({ message: 'Profile image updated successfully.', imagePath: user.profileImage });
  } catch (error) {
    res.status(500).send({ message: 'Error updating profile image.', error: error.message });
  }
};

// super admin only
const assignRoleToUser = async (req, res) => {
  const { userId, roleName } = req.body;

  if (!userId || !roleName) {
    return res.status(400).send('User ID and Role name are required.');
  }

  // Find the user
  const userToUpdate = await User.findById(userId);
  if (!userToUpdate) {
    return res.status(404).send('User not found.');
  }

  // Find the role by name
  const role = await Role.findOne({ name: roleName });
  if (!role) {
    return res.status(404).send('Role not found.');
  }

  // Update the user's roles
  userToUpdate.roles = [role._id];
  await userToUpdate.save();

  res.status(200).send({ message: `Role ${roleName} has been assigned to user.` });
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user and remove it
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    await User.findByIdAndRemove(userId);

    // remove user's profile image if exists
    if (user.profileImage) {
      const imagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).send({ message: 'User successfully deleted.' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};




module.exports = {
  register,
  login,
  getUsers,
  uploadProfileImage,
  assignRoleToUser,
  deleteUser
};
