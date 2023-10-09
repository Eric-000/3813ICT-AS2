const Group = require('../models/groupModel');
const User = require('../models/userModel');

const createGroup = async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;
  console.log(userId);

  // create group
  const group = new Group({
    name,
    createdBy: userId
  });
  await group.save();

  res.status(201).send({ groupId: group.id });
};

const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ createdBy: userId });
    res.status(200).send(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).send('Server error');
  }
};

const assignGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  try {
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
  
    // avoid duplicate
    if (!user.groups.includes(group._id)) {
      user.groups.push(group._id);
      await user.save();
    }
  
    res.status(200).send({ success: true });

  } catch (error) {
    console.error('Error assigning group:', error);
    res.status(500).send('Server error');
  }
};


module.exports = {
  createGroup,
  assignGroup,
  getGroups
};
