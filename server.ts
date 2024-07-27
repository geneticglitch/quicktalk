import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server, Socket } from "socket.io";
import { PrismaClient } from '@prisma/client';

interface CustomSocket extends Socket {
  user?: {
    id: string;
    email: string;
  };
}

const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev , dir: './' });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://192.168.1.103:3000",
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket: CustomSocket, next) => {
    const userId = socket.handshake.auth.user_id;
    if (!userId) {
      return next(new Error('Authentication failed'));
    }
    try {
      //! this defintly can be removed as the chat compoenent can send in the email
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      socket.user = {
        id: user.id,
        email: user.email
      };
      await prisma.socketConnection.create({
        data: {
          userId: user.id,
          socketId: socket.id
        }
      });
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: CustomSocket) => {
    console.log('A user connected:', socket.user?.id);
    console.log('A user connected:', socket.user?.email);

    socket.on('private message', async (data) => {
      const { recipientId, content } = data;
      const areFriends = await prisma.friend.findFirst({
        where: {
          OR: [
            { userId: socket.user?.id, friendId: recipientId },
            { userId: recipientId, friendId: socket.user?.id }
          ]
        }
      });

      if (!areFriends) {
        socket.emit('error', 'You are not friends with this user');
        return;
      }

      const recipientConnection = await prisma.socketConnection.findFirst({
        where: { userId: recipientId }
      });
      
      const savedMessage = await prisma.message.create({
        data: {
          content,
          senderId: socket.user?.id || '',
          recipientId: recipientId
        }
      });

      if (recipientConnection) {
        io.to(recipientConnection.socketId).emit('private message', savedMessage);
      }

      socket.emit('message sent');
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.user?.email);
      if (socket.user?.id) {
        await prisma.socketConnection.deleteMany({
          where: { userId: socket.user.id, socketId: socket.id }
        });
      }
    });
  });

  server.listen(3001, () => {
    console.log('> Ready on http://localhost:3001');
  });
});