import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
    authToken: string;
  }
  interface User {
    id: string;
    username: string;
  }
}
