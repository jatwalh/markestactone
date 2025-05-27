import app from './app';
import http from 'http';
import './config/db';

const PORT = 3000;

const myServer = http.createServer(app);

 
myServer.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});