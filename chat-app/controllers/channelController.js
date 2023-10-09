const Channel = require('../models/channelModel');
const Group = require('../models/groupModel');

const createChannel = async (req, res) => {
  const { name, groupId } = req.body;

  if (!groupId) {
    return res.status(400).send('GroupId is required.');
  }

  try {
    // Create a new channel
    const channel = new Channel({ name });
    await channel.save();

    // Find the group and add the channel to it
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).send('Group not found.');
    }
  
    group.channels.push(channel._id);
    await group.save();

    res.status(201).send({ channel: channel._id });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createChannel,
};

