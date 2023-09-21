const socketIO = require('socket.io');
const addListeners = require('./listeners');

const configureSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        addListeners(io, socket);
    });

    return io;
};

module.exports = configureSocket;

