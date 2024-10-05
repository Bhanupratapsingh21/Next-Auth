import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/Usermodel";
import bcrypt from "bcrypt";

const GITHUB_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


export const authOptions: NextAuthOptions = {
    secret: NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbconnect();
                if (!credentials.identifier || !credentials.password) {
                    throw new Error("indentifier and password not provided.");
                }
                console.log(credentials);
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }, // Changed identifier to email for clarity
                        ],
                    });

                    if (!user) {
                        throw new Error("User not found with this email or username.");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect password.");
                    }
                    console.log("Logged In Done", user)

                    return user;
                } catch (error: any) {
                    console.log(error)
                    throw new Error(error.message || "Authorization failed");
                }
            },
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID as string,
            clientSecret: GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({
            clientId: GITHUB_CLIENT_ID as string,
            clientSecret: GITHUB_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-In", // Make sure this path is correct
    },
    session: {
        strategy: "jwt",
    },
};

export default NextAuth(authOptions);