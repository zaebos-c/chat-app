const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Um usuário se conectou');

    socket.on('set username', (username) => {
        if (username && username.trim() !== '') {
            socket.username = username.trim();
            io.emit('user connected', `${socket.username} entrou no chat`);
        }
    });

    socket.on('chat message', (msg) => {
        if (socket.username) {
            io.emit('chat message', { user: socket.username, text: msg });
        }
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('user disconnected', `${socket.username} saiu do chat`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
