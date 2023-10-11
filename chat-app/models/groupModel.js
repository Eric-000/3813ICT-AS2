const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel'
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Group', groupSchema);
