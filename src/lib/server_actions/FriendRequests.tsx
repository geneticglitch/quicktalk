"use server"
import  prisma  from '@/lib/prisma';



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
            image: user?.image
        });
    }  
    return friend_requests_data;
}

const accept_decline_friend_request_SF = async (friend_request_id: string, action: string) => {
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