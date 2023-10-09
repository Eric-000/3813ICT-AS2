const socketIO = require('socket.io');
const addListeners = require('./listeners');
const videoRoomListeners = require('./videoRoomListeners');

const configureSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });

    const peerIds = [];

    io.on('connection', (socket) => {
        console.log('New WebSocket connection');
        console.log('peerIds', peerIds);
        videoRoomListeners(io, socket, peerIds);
        addListeners(io, socket);
    });

    return io;
};

module.exports = configureSocket;

