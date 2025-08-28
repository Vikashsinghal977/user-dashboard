import NextAuth, { CredentialsSignin } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import AppleProvider from "next-auth/providers/apple"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
        name: "Login",
        id: "credentials",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "Enter your Email" },
            password: { label: "Password", type: "password", placeholder: "Enter your Password" },
        },
        authorize: async ({email, password}) => {
            console.log("Credentials", email, password);

            if (typeof email !== "string") {
                throw new CredentialsSignin("Invalid email")
            }

            const user = {  email, _id:"1", name: "Demo User" }

            if (password === "password123" && email === "vikashsinghal509@gmail.com") {
                return user
            } else {
                throw new CredentialsSignin("Invalid email or password")
            }
        }
    }),
  ],
})