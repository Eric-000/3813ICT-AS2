const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  roles: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Role' 
    }
  ],
  groups: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
],
});

module.exports = mongoose.model('User', userSchema);
