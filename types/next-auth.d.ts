import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user: {
    id: string,
    fullName: string,
    email: string,
    role: UserRole,
    jwtToken: string
    } & DefaultSession["user"];
  }

  interface User {
    id: string,
    fullName: string,
    email: string,
    role: UserRole,
    jwtToken: string
  }

  export enum UserRole {
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    SUPPORT = "SUPPORT"
}
}