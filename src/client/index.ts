import io from 'socket.io-client';

const dev = location && location.hostname == "localhost" || false;
const serverUrl = dev ? "http://localhost:3333" : "";
const socket = io(serverUrl);

socket.on('message', function (msg) {
    console.log(msg)
  });
