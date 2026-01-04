import { Redirect } from 'expo-router';
import { useSession } from '../contexts/session';

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;

  return session ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}
