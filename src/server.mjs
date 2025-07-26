import morgan from "morgan";
import io, { httpServer, Start_App } from "./config/Socket/SocketServer.mjs";
import app from "./routes/app.mjs";
import envConstant from "./constant/env.constant.mjs";

import SocketEvent from "./config/Socket/SocketEvent.mjs";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", envConstant.FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content for preflight requests
  }
  next();
});


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to MandiExpress Backend',
    status: 'success',
    data: {
      name: 'MandiExpress Backend',
      version: '1.0.0',
      description: 'A backend service for MandiExpress',
    },
    });
});

io.on('connection', socket =>  SocketEvent(socket));


app.use(morgan('dev'));

httpServer.listen(envConstant.PORT, () => {
  Start_App();
  console.log(`Http and Socket Server is running on port ${envConstant.PORT}`);

});