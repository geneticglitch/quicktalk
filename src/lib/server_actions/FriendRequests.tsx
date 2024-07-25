"use server"
import  prisma  from '@/lib/prisma';

const get_friend_requests_SF = async (current_user_id: string) => {
    const friend_requests = await prisma.friendRequest.findMany({
        where: {
            receiverId: current_user_id,
            status: 'PENDING'
        },
        select: {
            senderId: true
        }
    });
    if(friend_requests.length === 0) {
        return [];
    }
    let friend_requests_data = [];
    for (const friend_request of friend_requests) {
        const user = await prisma.user.findUnique({
            where: {
                id: friend_request.senderId
            },
            select: {
                display_name: true,
                image: true,
                id: true
            }
        });
        friend_requests_data.push(user);
    }
    return friend_requests_data;
}

export { get_friend_requests_SF };