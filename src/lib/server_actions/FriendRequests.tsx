"use server"
import  prisma  from '@/lib/prisma';
import { send } from 'process';



const get_friend_requests_SF = async (current_user_id: string) => {
    const friend_requests = await prisma.friendRequest.findMany({
        where: {
            receiverId: current_user_id,
            status: 'PENDING'
        },
        select: {
            senderId: true,
            id: true
        }
    });
    if(friend_requests.length === 0) {
        return [];
    }
    let friend_requests_data = [];
    for (let i = 0; i < friend_requests.length; i++) {
        const friend_request = friend_requests[i];
        const user = await prisma.user.findUnique({
            where: {
                id: friend_request.senderId
            },
            select: {
                display_name: true,
                image: true
            }
        });
        friend_requests_data.push({
            id: friend_request.id,
            display_name: user?.display_name,
            image: user?.image,
            senderId: friend_request.senderId
        });
    }  
    return friend_requests_data;
}

const accept_decline_friend_request_SF = async (current_user_id:string, sender_user_id:string, friend_request_id: string, action: string) => {
    console.log(current_user_id)
    console.log(sender_user_id)
    console.log(friend_request_id)
    console.log(action)
    try {
        const friend_request = await prisma.friendRequest.findUnique({
            where: {
                id: friend_request_id
            }
        });
        if (!friend_request) {
            return;
        }
        if (action === 'Accept') {
            await prisma.friendRequest.update({
                where: {
                    id: friend_request_id
                },
                data: {
                    status: 'ACCEPTED'
                }
            });
            await prisma.friend.create({
                data: {
                    userId: current_user_id,
                    friendId: sender_user_id
                }
            });
            await prisma.friend.create({
                data: {
                    userId: sender_user_id,
                    friendId: current_user_id
                }
            });
        } else if (action === 'Decline') {
            await prisma.friendRequest.update({
                where: {
                    id: friend_request_id
                },
                data: {
                    status: 'DECLINED'
                }
            });
        }
    } catch (error) {
        console.error('Error accepting/declining friend request:', error);
    }
}

export { get_friend_requests_SF , accept_decline_friend_request_SF };