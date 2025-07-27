import AuthUtils from '../Auth/Auth.utils.mjs';
import ProductService from './Product.service.mjs';
import ProductUtils from './Product.utils.mjs';

export const ProductSocket = ({socket , io}) => {

console.log('Product Socket initialized for:', socket.id);
// Handle new bid placement
 try {
  socket.on(
    "placeBid",
    async ({ productId , vendorId, bidAmount, email, name }) => {
      try {
        console.log("Received bid data:", {
          productId,
          vendorId,
          bidAmount,
          email,
          name,
        });
  
      
  
        // Fetch the product by ID
        const product = await ProductUtils.findProductById(productId);
       
  
        // Validate the user by email
        const findUser = await AuthUtils.FindByEmail(email);
        if (!findUser) {
          throw new Error("Please enter a valid email ID to place a bid.");
        }
  
       
        // if (bidAmount <= product.) {
        //   throw new Error("Bid amount must be higher than the current highest bid.");
        // }
  
        // Call the Live_auction method to process the bid
        const result = await ProductService.Live_auction({

          productId,
          vendorId,
          bidAmount,
          email,
          name,
        });

      
        
  
      
      

        io.to(productId).emit("bidUpdate", result);

      } catch (error) {
        console.error("Error placing bid:", error.message);
        socket.emit("error", { message: error.message || "Failed to place bid." });
      }
    }
  );
 } catch (error) {
  socket.emit("error", { message: error.message || "Failed to initialize bid placement." });
  
 }


  // console.log('Product Socket initialized for:', socket.id);
  // io.on('connection', (socket) => {
  //   console.log(`User connected: ${socket.id}`);

  //   // Join a product-specific room
    
  //   // Handle new bid placement
  //   socket.on(
  //     'placeBid',
  //     async (data) => {
  //       try {
  //         console.log('Received bid data:', data);
          
  //         // socket.join()
         
         
  //         // // Validate and fetch product details
  //         // const product = await ProductUtils.findProductById(productId);
  //         // if (!product) {
  //         //   socket.emit('error', { message: 'Product not found.' });
  //         //   return;
  //         // }

  //         // // // Check if the bid amount is higher than the current highest bid
  //         // if (bidAmount <= product.highestBid) {
  //         //   socket.emit('error', {
  //         //     message:
  //         //       'Bid amount must be higher than the current highest bid.',
  //         //   });
  //         //   return;
  //         // }

  //         // // // Create a new bid object
  //         // const newBid = {
  //         //   bidderId: vendorId,
  //         //   amount: bidAmount,
  //         //   bidTime: new Date(),
  //         //   name,
  //         //   email,
  //         // };

  //         // // // Update the product's bids array and highest bid in the database
  //         // const updatedProduct = await ProductService.Live_auction({
  //         //   productId,
  //         //   data: {
  //         //     $push: { bids: newBid }, // Push the new bid to the bids array
  //         //     highestBid: bidAmount,
  //         //     highestBidder: vendorId,
  //         //   },
  //         // });

  //         // // console.log(
  //         // //   `New bid placed on product ${productId}: ${bidAmount} by ${vendorId}`
  //         // // );

  //         // // // Broadcast the new highest bid to all users in the room
  //         // io.to(productId).emit('bidUpdate', {
  //         //   highestBid: bidAmount,
  //         //   highestBidder: vendorId,
  //         //   bids: updatedProduct.bids,
  //         // });
  //       } catch (error) {
  //         console.error('Error placing bid:', error.message);
  //         socket.emit('error', { message: 'Failed to place bid.' });
  //       }
  //     }
  //   );

  //   // Handle user disconnect
  //   socket.on('disconnect', () => {
  //     console.log(`User disconnected: ${socket.id}`);
  //   });
  // });
};
