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
      clientId: process.env.Client_Id as string,
      clientSecret: process.env.Client_Screte as string,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: any;
      account: any;
    }): Promise<boolean> {
      // Call the server action to save the user in the database
      // try {
      //   // // Save the user info to the database
      //   console.log(user);
      //   if (user) {
      //     customGoogle(user);
      //     return true;
      //   }
      // } catch (error) {
      //   console.error("Error saving user to the database", error);
      //   return false; // Prevent login if saving fails
      // }

      if (account.provider === "google") {
        try {
          // Send user info to backend and get the access token
          const response = await googleToDB(user);
          // You can handle the response from the backend here

          console.log(response);
        } catch (error) {
          console.error("Error sending user info to backend:", error);
          return false; // Fail the sign-in process
        }
      }

      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
