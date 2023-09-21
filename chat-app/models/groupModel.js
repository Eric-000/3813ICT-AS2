const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel'
    }
  ],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Group', groupSchema);
