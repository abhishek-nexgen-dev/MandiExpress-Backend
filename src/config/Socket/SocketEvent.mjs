import { ProductSocket } from '../../api/v1/Product/Product.Socket.mjs';
import io from './SocketServer.mjs';

let SocketEvent = (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  ProductSocket({socket, io});

  socket.emit('welcome', { message: 'Welcome to the Socket.IO Server' });
};

export default SocketEvent;
