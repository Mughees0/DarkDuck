import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb/index";
import dbConnect from "../../../../lib/mongodb/dbConnect";
// import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { compare } from "bcrypt";

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/providers/oauth

export const handler = NextAuth({
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isAdmin: token.isAdmin,
          vendorId: token.vendorId,
          stripe_id: token.stripeId,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        await dbConnect();

        // Find user with the email
        const user = await User.findOne({
          email: credentials?.email,
        });

        // Email Not found
        if (!user) {
          throw new Error("Email is not registered");
        }

        // Check hased password with DB hashed password
        const isPasswordCorrect = await compare(
          credentials!.password,
          user.hashedPassword
        );

        // Incorrect password
        if (!isPasswordCorrect) {
          throw new Error("Password is incorrect");
        }

        return user;
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_SMTP_PORT,
    //     auth: {
    //       user: process.env.EMAIL_AUTH_USER,
    //       pass: process.env.EMAIL_AUTH_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    //   normalizeIdentifier(identifier: string): string {
    //     // Get the first two elements only,
    //     // separated by `@` from user input.
    //     let [local, domain] = identifier.toLowerCase().trim().split("@");
    //     // The part before "@" can contain a ","
    //     // but we remove it on the domain part
    //     domain = domain.split(",")[0];
    //     return `${local}@${domain}`;

    //     // You can also throw an error, which will redirect the user
    //     // to the error page with error=EmailSignin in the URL
    //     // if (identifier.split("@").length > 2) {
    //     //   throw new Error("Only one email allowed")
    //     // }
    //   },
    // }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
