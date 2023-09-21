const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const checkPermissions = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // check token
      const token = req.headers.authorization.split(" ")[1];
      
      // decode token
      const decoded = jwt.verify(token, 'secretKey');
      
      // get user with role
      const user = await User.findById(decoded.id).populate('roles');
      
      if (!user) {
        return res.status(401).send('Authentication failed.');
      }

      // check if user has the required role
      const roles = user.roles.map(role => role.name);
      if (roles.includes(requiredRole)) {
        next();  // pass the middleware
      } else {
        return res.status(403).send('Forbidden: You do not have permission.');
      }

    } catch (error) {
      return res.status(401).send('Authentication failed.');
    }
  };
};

module.exports = checkPermissions;
