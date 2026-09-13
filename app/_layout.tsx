import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { seedSpotsIfEmpty } from '../firebase/db';

export default function RootLayout() {
  const { firebaseUser, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!firebaseUser && !inAuth) {
      router.replace('/(auth)/login');
    } else if (firebaseUser && inAuth) {
      seedSpotsIfEmpty();
      router.replace('/(tabs)');
    }
  }, [firebaseUser, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="spot/[id]"
        options={{ headerShown: true, title: 'Spot Details', headerStyle: { backgroundColor: '#13131F' }, headerTintColor: '#F0F0F0' }}
      />
    </Stack>
  );
}
