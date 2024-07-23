"use server"
import  prisma  from '@/lib/prisma';

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
    return user;
}

export { search_friend_SF };