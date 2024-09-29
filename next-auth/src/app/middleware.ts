import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin', // Redirect to the sign-in page if not authenticated
  },
});

export const config = {
  matcher: ['/dashboard'], // Replace with the routes you want to protect
};
