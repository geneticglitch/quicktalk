"use server"
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function authenticate_user(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  // Check if the user is a Google user
  if (user.type === 'GOOGLE') {
    return null
  }

  // Check that the password is valid
  const passwordValid = await bcrypt.compare(password, user.password!);
  if (!passwordValid) {
    return null;
  }

  // Return the user
  return user;
}

export const handle_google_login = async (account: any, profile: any) => {
  try {
    // Check if the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email as string },
    });

    if (!existingUser) {
      // Add the Google user to the database
      await prisma.user.create({
        data: {
          id: account.providerAccountId,
          name: profile.name,
          email: profile.email,
          type: 'GOOGLE',
        },
      });
    } else if (existingUser.type !== 'GOOGLE') {
      // Handle the case where a local user with the same email exists
      console.error("A local user with the same email already exists.");
      return false;
    }
    return true;
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
};
