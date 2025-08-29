import NextAuth, { CredentialsSignin } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import AppleProvider from "next-auth/providers/apple"
import { User } from "@/models/userModel"

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
        authorize: async (credentials:any) => {

            const { email, password } = credentials as string | any

            if (!email || !password) {
                throw new CredentialsSignin("Email and Password are required")
            }

            const user = await User.findOne({ email }).select("+password")

            if (!user) {
                throw new CredentialsSignin("No user found with the given email")
            }

            if (!user.password) {
                throw new CredentialsSignin("Please login with Google")
            }

            const isMatch = password === user.password;

            if (!isMatch) {
                throw new CredentialsSignin("Invalid email or password")
            }
            
            return {
                name: user.name,
                email: user.email,
                id: user._id.toString(),
            };

        }
    }),
  ],
})