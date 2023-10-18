import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

const Handler = NextAuth(authOptions);

export { Handler as GET, Handler as POST };
