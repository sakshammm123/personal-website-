import { authConfig } from "./auth";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
