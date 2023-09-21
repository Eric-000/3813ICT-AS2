const mongoose = require('mongoose');
const User = require('./models/userModel');
const Role = require('./models/roleModel');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/myDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const seedDatabase = async () => {
  // Create Roles
  const superAdminRole = new Role({ name: 'Super Admin', permissions: ['all'] });
  const groupAdminRole = new Role({ name: 'Group Admin', permissions: ['createGroup', 'deleteGroup'] });
  const userRole = new Role({ name: 'User', permissions: ['joinGroup'] });

  await superAdminRole.save();
  await groupAdminRole.save();
  await userRole.save();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 8);

  // Create Users
  const superAdminUser = new User({ username: 'superAdmin', password: hashedPassword, roles: [superAdminRole._id] });
  const groupAdminUser = new User({ username: 'groupAdmin', password: hashedPassword, roles: [groupAdminRole._id] });
  const normalUser = new User({ username: 'normalUser', password: hashedPassword, roles: [userRole._id] });

  await superAdminUser.save();
  await groupAdminUser.save();
  await normalUser.save();

  console.log('Database seeded.');
};

seedDatabase().then(() => {
  mongoose.connection.close();
});