import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Login",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;
        if (!email || !password) {
          throw new CredentialsSignin("Email and Password are required");
        }
        const demoUser = {
          id: "1",
          name: "Demo User",
          email: "demo@gmail.com",
          password: "password@123",
        };
        if (email === demoUser.email && password === demoUser.password) {
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
          };
        }
        throw new CredentialsSignin("Invalid email or password");
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
};