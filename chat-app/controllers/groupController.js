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

const getGroupAdminGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ createdBy: userId }).populate('channels');
    res.status(200).send(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).send('Server error');
  }
}

const getSuperAdminGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('channels');
    res.status(200).send(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).send('Server error');
  }
}

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

const removeUserFromGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send('User not found.');
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).send('Group not found.');
    }

    const groupIndex = user.groups.indexOf(group._id);
    if (groupIndex > -1) {
      user.groups.splice(groupIndex, 1);
      await user.save();
    } else {
      return res.status(400).send('User is not a member of the specified group.');
    }

    res.status(200).send({ success: true });

  } catch (error) {
    console.error('Error removing user from group:', error);
    res.status(500).send('Server error');
  }
};

const deleteGroup = async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user._id;

  try {
    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).send('Group not found.');
    }

    if (group.createdBy.toString() !== userId.toString()) {
      return res.status(403).send('You do not have permission to delete this group.');
    }

    // Remove the group
    await Group.findByIdAndRemove(groupId);

    // Remove this group reference from all users
    await User.updateMany({}, { $pull: { groups: groupId } });

    res.status(200).send({ success: true, message: 'Group deleted successfully.' });

  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).send('Server error');
  }
};



module.exports = {
  createGroup,
  assignGroup,
  getGroups,
  removeUserFromGroup,
  deleteGroup,
  getGroupAdminGroups,
  getSuperAdminGroups
};