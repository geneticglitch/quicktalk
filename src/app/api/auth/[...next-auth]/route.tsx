import NextAuth, { NextAuthOptions } from "next-auth"
import { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { authenticate_user ,handle_google_login } from "./server_actions"

declare module "next-auth" {
interface Session {
    user?: {
    id: string;
    } & DefaultSession["user"];
  }
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
throw new Error('OAuth environment variables are not set.');
}
  

export const authOptions:NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
        name: 'Sign in',
        credentials: {
          email: { label: 'Email', type: 'email'},
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          console.log(credentials)
          if (!credentials || !credentials.email || !credentials.password) {
            return null;
          }
          console.log(credentials)
          const user = await authenticate_user(credentials.email, credentials.password);
          if (user){
            return {
              ...user,
              id: String(user.id),
            };
          }
          return null;
        },
      }),
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      const provider = account?.provider;
      console.log(account, profile)
      if (provider === 'google') {
        const result =  await handle_google_login(account, profile);
        return result;
      }
      return true;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };