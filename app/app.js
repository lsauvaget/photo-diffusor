const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 3000;
const {IO} = require('./socket');
const slideshow = require('./lib/slideshow');
const routes = require('./routes');
const io = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));


const prerequisite = [
  slideshow.init()
];

Promise.all(prerequisite)
.then(() => {
  IO.create(server, io);
  app.use(cors());
  app.use(routes);
})
.then(() => {
    server.listen(PORT, () => {
        console.log(`server listen on ${PORT}`)
    });
});
