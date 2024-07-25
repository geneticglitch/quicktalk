const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const Redis = require("ioredis");
const { getSession } = require('next-auth/react');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev , dir: './' });
const handle = app.getRequestHandler();

const redisClient = new Redis(process.env.REDIS_URL); 
const pubClient = redisClient.duplicate();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);
  io.adapter(createAdapter(pubClient, redisClient));

  io.use(async (socket, next) => {
    const session = await getSession({ req: socket.request });
    if (session) {
      socket.user = session.user;
      await redisClient.set(`user:${socket.user.id}:socket`, socket.id);
      next();
    } else {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.user.email);

    socket.on('private message', async (data) => {
      const { recipientId, message } = data;
      
      // Check if users are friends
      const areFriends = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: socket.user.id, friendId: recipientId },
            { userId: recipientId, friendId: socket.user.id }
          ]
        }
      });

      if (!areFriends) {
        socket.emit('error', 'You are not friends with this user');
        return;
      }

      // Get recipient's socket id from Redis
      const recipientSocketId = await redisClient.get(`user:${recipientId}:socket`);
      
      if (recipientSocketId) {
        // Send message to recipient
        io.to(recipientSocketId).emit('private message', {
          from: socket.user.id,
          message: message
        });
      }

      // Save message to database
      await prisma.message.create({
        data: {
          content: message,
          senderId: socket.user.id,
          recipientId: recipientId
        }
      });
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.user.email);
      await redisClient.del(`user:${socket.user.id}:socket`);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});