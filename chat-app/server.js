const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const groupRoutes = require('./routes/groupRoutes');
const channelRoutes = require('./routes/channelRoutes');
const http = require('http');
const configureSocket = require('./socket');
const { ExpressPeerServer } = require('peer');

const app = express();
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const server = http.createServer(app);

// socket configuration
configureSocket(server);

// PeerServer configuration
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/myapp'
});

app.use('/peerjs', peerServer);
app.use(express.json());

// routes
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/groups', groupRoutes);
app.use('/channels', channelRoutes);


server.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
