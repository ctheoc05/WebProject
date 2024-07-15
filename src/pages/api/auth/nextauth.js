import NextAuth from 'next-auth';
import { sqlConfig } from '../../../config';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: 'signup',
      type: 'oauth',
      name: 'signup',
      callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
          try {
            const pool = new sqlConfig();
            const result = await pool.request()
              .input('email', email)
              .input('password', credentials.password)
              .execute('dbo.sp_signup');
            if (result.recordset.length > 0) {
              return true;
            } else {
              return false;
            }
          } catch (error) {
            console.error(error);
            return false;
          }
        },
      },
    },
  ],
  // Enable debug logging
  debug: true,
});