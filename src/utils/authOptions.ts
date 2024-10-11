/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { googleToDB } from "./actions/Authaction";

export const authOption: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    // }),

    GoogleProvider({
      clientId: process.env.Client_ID as string,
      clientSecret: process.env.Client_Secret as string,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }): Promise<boolean> {
      // Call the server action to save the user in the database
      try {
        // // Save the user info to the database

        // console.log(user);

        if (user) {
          await googleToDB(user);
        }

        return true;
      } catch (error) {
        console.error("Error saving user to the database", error);
        return false; // Prevent login if saving fails
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
