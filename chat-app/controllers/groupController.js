const Group = require('../models/groupModel');
const User = require('../models/userModel');

const createGroup = async (req, res) => {
  const { name } = req.body;

  // create group
  const group = new Group({
    name,
  });
  await group.save();

  res.status(201).send({ groupId: group.id });
};

const assignGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  // check user existed
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send('User not found.');
  }

  // check group existed
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(400).send('Group not found.');
  }

  // add group to user
  user.groups.push(group.id);
  await user.save();

  res.status(200).send({ success: true });
};

module.exports = {
  createGroup,
  assignGroup,
};
