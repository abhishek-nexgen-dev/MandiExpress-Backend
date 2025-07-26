import { createServer } from 'http'; // Use 'https' if doing HTTPS
import path from 'path';
import { Server } from 'socket.io';
import envConstant from '../../constant/env.constant.mjs';


import { db_connect } from '../Db.config.mjs';
import app from '../../routes/app.mjs';

console.log(path.resolve());

// ✅ Create HTTP server and attach Express app
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'https://www.growrichmindset.in'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true,
});

const PORT = envConstant.PORT || 8000;

const Start_App = async () => {
  try {
  
    await db_connect();
    
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};



export { Start_App, httpServer, PORT };
export default io;

