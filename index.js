// code away!
// implement your API here
const express = require('express'); // built in node.js module to handle http traffic
const hostname = '127.0.0.1'; // the local computer where the server is running
const port = 3000; // a port we'll use to watch for traffic
const server = express();
const postsRoutes = require('./posts/postRouter');
const usersRoutes = require('./users/userRouter');
server.use(express.json());
//server.use(logger);

server.use('/api/posts', postsRoutes);
server.use('/api/users', usersRoutes);

server.use('/', (req, res) => { res.send('api is up and running')});

server.listen(port, hostname, () => {
    // start watching for connections on the port specified
    console.log(`Server running at http://${hostname}:${port}/`);
  });

  function logger(req,res,next)
  {
    console.log(`${req.method} is being used at ${req.url} at ${Date.now()}`);
    next();
  }