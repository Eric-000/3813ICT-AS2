const addListeners = (io, socket) => {
    console.log('New user connected');

    socket.on('join', (group) => {
        console.log(`User joined group: ${group}`);
        socket.join(group);
    });

    socket.on('sendMessage', (message, group) => {
        io.to(group).emit('newMessage', message);
    });

    socket.on('leave', (group) => {
        console.log(`User left group: ${group}`);
        socket.leave(group);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
};

module.exports = addListeners;
