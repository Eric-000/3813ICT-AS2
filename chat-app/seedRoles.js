const mongoose = require('mongoose');
const Role = require('./models/roleModel');

mongoose.connect('mongodb://127.0.0.1:27017/myDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const seedRoles = async () => {
  // Delete existing roles
  await Role.deleteMany();

  // Create roles with permissions
  await Role.create({
    name: 'Super Admin',
    permissions: [
      'promote_to_group_admin',
      'remove_any_chat_users',
      'upgrade_to_super_admin',
      'all_group_admin_functions'
    ],
  });

  await Role.create({
    name: 'Group Admin',
    permissions: [
      'create_groups',
      'create_channels',
      'remove_groups_channels_users',
      'delete_chat_users',
      'modify_delete_own_group',
      'ban_user_from_channel',
      'report_to_super_admin'
    ],
  });

  await Role.create({
    name: 'User',
    permissions: [
      'create_chat_user',
      'join_any_channel_in_group',
      'register_interest_in_group',
      'leave_group',
      'delete_self'
    ],
  });

  console.log('Roles have been seeded!');
  mongoose.connection.close();
};

seedRoles();
