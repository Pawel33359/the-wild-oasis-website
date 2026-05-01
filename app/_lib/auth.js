import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  //   secret: process.env.NEXTAUTH_SECRET,
  //   session: {
  //     strategy: "jwt",
  //   },
};

// export const {
//   auth,
//   handlers: { GET, POST },
// } = NextAuth(authConfig);

const handlers = NextAuth(authConfig);
export { authConfig, handlers as GET, handlers as POST };

// export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
