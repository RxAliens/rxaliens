import NextAuth from "next-auth";


export const authOptions = {

  providers: [],

  secret: process.env.AUTH_SECRET,


  pages: {
    signIn: "/",
  },


};


export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);