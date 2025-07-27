import AuthUtils from '../Auth/Auth.utils.mjs';
import ProductService from './Product.service.mjs';
import ProductUtils from './Product.utils.mjs';

export const ProductSocket = ({ socket, io }) => {
  console.log('Product Socket initialized for:', socket.id);

  // Handle joining a product-specific room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // Handle placing a new bid
  socket.on('placeBid', async ({ productId, vendorId, bidAmount, email, name }) => {
    try {
      console.log('Received bid data:', { productId, vendorId, bidAmount, email, name });

      const product = await ProductUtils.findProductById(productId);
      if (!product) {
        throw new Error('Product not found.');
      }

      // Optional user validation (uncomment if needed)
      // const findUser = await AuthUtils.FindByEmail(email);
      // if (!findUser) {
      //   throw new Error('Please enter a valid email ID to place a bid.');
      // }

      if (bidAmount <= product.highestBid) {
        throw new Error('Bid amount must be higher than the current highest bid.');
      }

      const newBid = await ProductService.Live_auction({
        productId,
        vendorId,
        bidAmount,
        email,
        name,
      });

      console.log('Bid placed successfully:', newBid);

      // Emit the updated bids to all clients in the product room
      io.to(productId).emit('bidUpdate', newBid);
    } catch (error) {
      console.error('Error placing bid:', error.message);
      socket.emit('error', { message: error.message || 'Failed to place bid.' });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
