'use client';

import AuthForm from './AuthForm';
import { useQueryParam } from './usePlatform';

export default function JoinClient() {
  const next = useQueryParam('next');
  return <AuthForm next={next && next.startsWith('/') ? decodeURIComponent(next) : '/account/'} />;
}
