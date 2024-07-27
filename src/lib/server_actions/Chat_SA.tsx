"use server"
import prisma from "../../lib/prisma";

export async function get_messages(userId: string, friendId: string) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: friendId },
        { senderId: friendId, recipientId: userId }
      ]
    },
    take: 20,
    orderBy: {
      createdAt: 'asc'
    }
  });
}