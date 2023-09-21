const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: String,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
});

module.exports = mongoose.model('Channel', channelSchema);
