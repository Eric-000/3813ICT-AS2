module.exports = (io, socket, peerIds) => {
  socket.on('join-video-room', (data) => {
    const { peerId, roomId, username } = data;
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`User ${username} joined the room ${roomId} with peer ID: ${peerId}`);
    peerIds.push({ peerId, roomId, username });

    io.to(roomId).emit('update-users', peerIds.filter(p => p.roomId === roomId));
  });

  socket.on('leave-video-room', (data) => {
    const { peerId, roomId } = data;

    const index = peerIds.findIndex(p => p.peerId === peerId);
    if (index !== -1) {
      peerIds.splice(index, 1);
    }

    socket.leave(roomId);

    io.to(roomId).emit('update-users', peerIds.filter(p => p.roomId === roomId));
    io.to(roomId).emit('user-left', { peerId });
  });

  socket.on('disconnect', () => {
    const associatedPeerId = peerIds.find(p => p.peerId === socket.peerId);
    if (associatedPeerId) {
      const index = peerIds.indexOf(associatedPeerId);
      peerIds.splice(index, 1);
      io.to(socket.roomId).emit('update-users', peerIds.filter(p => p.roomId === socket.roomId));
    }
  });
};
