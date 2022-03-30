import 'dotenv/config';
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import registerMapHandlers from './mapHandler.js';

// MongoDB config
const mongoDB = process.env.MONGO_DB;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// HTTP server config
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

io.on('connection', (socket) => {
  console.log('Socket ID: ' + socket.id);

  registerMapHandlers(io, socket);
});

httpServer.listen(3000);
