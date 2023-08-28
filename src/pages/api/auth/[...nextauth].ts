import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.G_CLIENT_ID as string,
      clientSecret: process.env.G_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      let sessionFormat = { ...session, user: { ...session.user, ...user } };
      const authToken = jwt.sign(
        sessionFormat,
        process.env.JWT_SECRET as string,
      );
      return { ...sessionFormat, authToken };
    },
  },
});
