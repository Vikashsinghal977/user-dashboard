// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
