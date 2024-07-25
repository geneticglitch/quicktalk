"use server"
import  prisma  from '../prisma';

const search_friend_SF = async (display_name: string, current_user_id: string) => {
    const user = await prisma.user.findMany({
        where: {
            display_name: {
                contains: display_name
            },
            id: {
                not: current_user_id
            }
        },
        select: {
            display_name: true,
            image: true,
            id: true
        }
    });
    if(user.length === 0) {
        return null;
    }
    return user;
}

const add_friend_SF = async (current_user_id: string, friend_id: string) => {
    try {
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId: current_user_id, receiverId: friend_id },
                    { senderId: friend_id, receiverId: current_user_id }
                ]
            }
        });

        if (existingRequest) {
            if (existingRequest.status === 'PENDING') { 
                return { success: false, message: "A friend request already exists" };
            } else if (existingRequest.status === 'ACCEPTED') {
                return { success: false, message: "You are already friends" };
            }
        }

        const newFriendRequest = await prisma.friendRequest.create({
            data: {
                senderId: current_user_id,
                receiverId: friend_id,
                status: 'PENDING'
            }
        });

        return { success: true, message: "Friend request sent successfully", request: newFriendRequest };
    } catch (error) {
        console.error('Error adding friend:', error);
        return { success: false, message: "An error occurred while sending the friend request" };
    }
}

export { search_friend_SF , add_friend_SF };