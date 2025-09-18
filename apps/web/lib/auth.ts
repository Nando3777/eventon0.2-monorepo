import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { z } from 'zod';
import { fetchAuthProfile, loginWithCredentials } from '@/lib/api-client';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

type AuthorisedUser = {
  id: string;
  name?: string | null;
  email: string;
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  roles?: string[];
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        try {
          const loginResponse = await loginWithCredentials(parsed.data);
          const profile = await fetchAuthProfile(loginResponse.accessToken, loginResponse.tokenType);
          const user: AuthorisedUser = {
            id: profile.id,
            name: profile.name ?? profile.email,
            email: profile.email,
            accessToken: loginResponse.accessToken,
            tokenType: loginResponse.tokenType,
            expiresAt: Math.floor(Date.now() / 1000 + loginResponse.expiresIn),
            roles: profile.roles ?? [],
          };
          return user;
        } catch (error) {
          console.error('Failed to authorise credentials', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authorised = user as AuthorisedUser;
        token.sub = authorised.id;
        token.name = authorised.name ?? authorised.email;
        token.email = authorised.email;
        token.accessToken = authorised.accessToken;
        token.tokenType = authorised.tokenType;
        token.expiresAt = authorised.expiresAt;
        token.roles = authorised.roles ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        (session.user as typeof session.user & { roles?: string[] }).roles =
          (token.roles as string[] | undefined) ?? [];
        (session.user as typeof session.user & { id?: string }).id = token.sub as string | undefined;
      }

      (session as typeof session & { accessToken?: string; tokenType?: string; expiresAt?: number }).accessToken =
        (token.accessToken as string | undefined) ?? undefined;
      (session as typeof session & { tokenType?: string }).tokenType =
        (token.tokenType as string | undefined) ?? undefined;
      (session as typeof session & { expiresAt?: number }).expiresAt =
        (token.expiresAt as number | undefined) ?? undefined;

      return session;
    },
  },
};
