const Channel = require('../models/channelModel');

const createChannel = async (req, res) => {
  const { name } = req.body;

  // create Channel
  const channel = new Channel({
    name,
  });
  await channel.save();

  res.status(201).send({ channel: channel.id });
};


module.exports = {
  createChannel,
};
