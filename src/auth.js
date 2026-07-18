import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginService } from "@/features/auth/services/login.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const user = await loginService(
          credentials.email,
          credentials.password,
        );

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }

    return token;
  },

  async session({ session, token }) {
    session.user.id = token.id;
    session.user.role = token.role;

    return session;
  },
},

  session: {
    strategy: "jwt",
  },

  //   pages: {
  //     signIn: "/login",
  //   },

  secret: process.env.NEXTAUTH_SECRET,
});
