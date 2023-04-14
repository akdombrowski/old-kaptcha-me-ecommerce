import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

interface PingOneProfile extends Record<string, any> {
  aud: string;
  email: string;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  name: string;
  picture: string;
  sub: string;
}

function PingOneProvider<P extends PingOneProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "pingone",
    name: "PingOne",
    type: "oauth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    // authorization: {
    //   url: "https://auth.pingone.com/4e5491d5-74b6-4953-a3d1-c29f76f34d93/as/authorize",
    //   params: { scope: "openid email profile" },
    // },
    // token:
    //   "https://auth.pingone.com/4e5491d5-74b6-4953-a3d1-c29f76f34d93/as/token",
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
    style: {
      logo: "logo-pingidentity.png",
      logoDark: "logo-pingidentity.png",
      bg: "#fff",
      bgDark: "#000",
      text: "#000",
      textDark: "#fff",
    },
    options,
  };
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // ...add more providers here
    PingOneProvider({
      issuer: process.env.PINGONE_ISSUER,
      clientId: process.env.PINGONE_CLIENT_ID as string,
      clientSecret: process.env.PINGONE_SECRET as string,
    }),
  ],
  callbacks: {
    session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      const t = token;
      console.log("t");
      console.log(t);
      const u = user;
      console.log("u");
      console.log(u);
      return session;
    },
  },
};

export default NextAuth(authOptions);
