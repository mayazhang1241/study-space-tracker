import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useSpots } from '../../hooks/useSpots';
import { signOut } from '../../firebase/auth';
import { checkOut } from '../../firebase/db';
import { useState } from 'react';

export default function ProfileScreen() {
  const { firebaseUser, appUser } = useAuth();
  const { spots } = useSpots();
  const [signingOut, setSigningOut] = useState(false);

  const checkedInSpot = appUser?.currentCheckin
    ? spots.find((s) => s.id === appUser.currentCheckin)
    : null;

  async function handleCheckOut() {
    if (!firebaseUser || !appUser?.currentCheckin) return;
    await checkOut(firebaseUser.uid, appUser.currentCheckin);
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{firebaseUser?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Check-in</Text>
        {checkedInSpot ? (
          <View style={styles.checkinCard}>
            <View style={styles.checkinInfo}>
              <Text style={styles.checkinName}>{checkedInSpot.name}</Text>
              <Text style={styles.checkinBuilding}>
                {checkedInSpot.building} · {checkedInSpot.floor} floor
              </Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckOut}>
              <Text style={styles.checkoutText}>Check out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noCheckin}>Not checked in anywhere.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{appUser?.favoriteSpots.length ?? 0}</Text>
            <Text style={styles.statLabel}>Saved spots</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator color="#E74C3C" />
          ) : (
            <Text style={styles.signOutText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13131F' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  title: { color: '#B3A369', fontSize: 24, fontWeight: '800' },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: { color: '#F0F0F0', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  label: { color: '#9090A0', fontSize: 13, marginBottom: 4 },
  email: { color: '#F0F0F0', fontSize: 16, fontWeight: '600' },
  checkinCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  checkinInfo: { flex: 1, marginRight: 12 },
  checkinName: { color: '#F0F0F0', fontWeight: '700', fontSize: 15 },
  checkinBuilding: { color: '#9090A0', fontSize: 13, marginTop: 2 },
  checkoutButton: {
    backgroundColor: '#2A2A3E',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  checkoutText: { color: '#E74C3C', fontWeight: '700', fontSize: 13 },
  noCheckin: { color: '#9090A0', fontSize: 15 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  statValue: { color: '#B3A369', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#9090A0', fontSize: 12, marginTop: 4 },
  bottom: { position: 'absolute', bottom: 32, left: 16, right: 16 },
  signOutButton: {
    backgroundColor: '#1E1E2E',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  signOutText: { color: '#E74C3C', fontWeight: '700', fontSize: 15 },
});
