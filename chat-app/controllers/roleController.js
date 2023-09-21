const Role = require('../models/roleModel');

const createRole = async (req, res) => {
  const { name, permissions } = req.body;

  if(!name || !permissions || !permissions.length) {
    return res.status(400).send('Missing name or permissions.');
  }
  // check role existed
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    return res.status(400).send('Role already exists.');
  }

  // create a new role
  const role = new Role({
    name,
    permissions,
  });
  await role.save();

  res.status(201).send({ role });
};

module.exports = {
  createRole,
};
