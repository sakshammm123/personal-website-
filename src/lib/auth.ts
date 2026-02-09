import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { checkLoginRateLimit, logLoginAttempt, getIpAddress } from "@/lib/rate-limit";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Note: Rate limiting and logging will be handled via middleware
        // NextAuth v5 authorize doesn't have direct access to request headers
        // We'll handle rate limiting in a wrapper API route if needed

        const admin = await db.admin.findUnique({
          where: { username: credentials.username as string }
        });

        if (!admin) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          admin.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: admin.id.toString(),
          name: admin.username,
        };
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user, account, credentials }) {
      // Rate limiting and logging will be handled in the custom sign-in route
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
