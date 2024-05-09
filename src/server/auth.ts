import { ProviderType } from 'next-auth/providers/index';

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string;
      address?: string;
      image?: string;
      walletType?: string;
      isAdmin?: boolean;
    };
  }
  interface User {
    id: string;
    name: string | null;
    defaultAddress: string | null;
    nonce: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
  }
  interface Session {
    walletType?: string;
  }
  interface JWT {
    walletType?: string;
  }
  interface Account {
    id: string;
    userId?: string;
    type: ProviderType;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
    user: User;
  }
  interface Wallet {
    id: number;
    changeAddress: string;
    unusedAddresses: string[];
    usedAddresses: string[];
    userId: string;
    type: string | null;
  }
}

// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks,
//  * etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  **/
// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_SECRET_ID!
//     }),
//     CredentialsProvider({
//       name: "z",
//       credentials: {
//         message: {
//           label: "Message",
//           type: "text",
//           placeholder: "0x0",
//         },
//         signature: {
//           label: "Signature",
//           type: "text",
//           placeholder: "0x0",
//         },
//       },
//       async authorize(credentials) {
//         try {
//           const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
//           const domain = process.env.DOMAIN
//           if (siwe.domain !== domain) {
//             return null
//           }

//           if (siwe.nonce !== (await getCsrfToken({ req }))) {
//             return null
//           }

//           await siwe.validate(credentials?.signature || "")
//           return {
//             id: siwe.address,
//           }
//         } catch (e) {
//           return null
//         }
//       },
//     })
//   ],
//   callbacks: {
//     async session({ session, user }) {
//       // Include the user's ID in the session
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: user.id,
//         },
//       };
//     },
//   },
//   jwt: {

//   }
// };

// /**
//  * Wrapper for `getServerSession` so that you don't need to import the
//  * `authOptions` in every file.
//  *
//  * @see https://next-auth.js.org/configuration/nextjs
//  **/
// export const getServerAuthSession = (ctx: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
//   return getServerSession(ctx.req, ctx.res, authOptions);
// };
