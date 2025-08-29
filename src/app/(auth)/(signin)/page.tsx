import { Metadata } from 'next';
import SignInViewPage from '../_components/_signin-view';

export const metadata: Metadata = {
    title: 'Authentication | Sign In',
    description: 'Sign in to your account',
};


export default function Page() {
    return <SignInViewPage />
};
