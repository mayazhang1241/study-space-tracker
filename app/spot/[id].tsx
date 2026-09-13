import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSpots } from '../../hooks/useSpots';
import { useAuth } from '../../hooks/useAuth';
import { checkIn, checkOut, toggleFavorite } from '../../firebase/db';
import { AvailabilityBadge } from '../../components/AvailabilityBadge';
import { useState } from 'react';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spots } = useSpots();
  const { firebaseUser, appUser } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  const spot = spots.find((s) => s.id === id);
  const isCheckedIn = appUser?.currentCheckin === id;
  const isFavorite = appUser?.favoriteSpots.includes(id ?? '') ?? false;

  async function handleCheckInOut() {
    if (!firebaseUser || !spot) return;
    setActionLoading(true);
    try {
      if (isCheckedIn) {
        await checkOut(firebaseUser.uid, spot.id);
      } else {
        if (appUser?.currentCheckin) {
          await checkOut(firebaseUser.uid, appUser.currentCheckin);
        }
        await checkIn(firebaseUser.uid, spot.id);
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleToggleFavorite() {
    if (!firebaseUser || !spot) return;
    await toggleFavorite(firebaseUser.uid, spot.id, isFavorite);
  }

  if (!spot) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#B3A369" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  const occupancyPct = Math.round((spot.currentOccupancy / spot.capacity) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{spot.name}</Text>
            <Text style={styles.building}>{spot.building}</Text>
            <Text style={styles.floor}>{spot.floor} floor</Text>
          </View>
          <TouchableOpacity onPress={handleToggleFavorite} hitSlop={8}>
            <Text style={[styles.heart, isFavorite && styles.heartActive]}>{isFavorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.badgeRow}>
          <AvailabilityBadge
            isAvailable={spot.isAvailable}
            currentOccupancy={spot.currentOccupancy}
            capacity={spot.capacity}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.description}>{spot.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Occupancy</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${occupancyPct}%` as any, backgroundColor: occupancyPct > 80 ? '#E74C3C' : occupancyPct > 60 ? '#E6A817' : '#2ECC71' }]} />
          </View>
          <Text style={styles.occupancyText}>
            {spot.currentOccupancy} of {spot.capacity} seats occupied ({occupancyPct}%)
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {spot.amenities.map((a) => (
              <View key={a} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Last updated</Text>
          <Text style={styles.timestamp}>
            {spot.lastUpdated instanceof Date
              ? spot.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Unknown'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isCheckedIn ? styles.actionButtonCheckout : styles.actionButtonCheckin,
            !spot.isAvailable && !isCheckedIn && styles.actionButtonDisabled,
          ]}
          onPress={handleCheckInOut}
          disabled={actionLoading || (!spot.isAvailable && !isCheckedIn)}
          activeOpacity={0.85}
        >
          {actionLoading ? (
            <ActivityIndicator color="#13131F" />
          ) : (
            <Text style={styles.actionButtonText}>
              {isCheckedIn ? 'Check Out' : spot.isAvailable ? 'Check In' : 'Spot Full'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13131F' },
  scroll: { padding: 16, paddingBottom: 100 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleBlock: { flex: 1, marginRight: 12 },
  name: { color: '#F0F0F0', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  building: { color: '#B3A369', fontSize: 15, fontWeight: '600' },
  floor: { color: '#9090A0', fontSize: 13, marginTop: 2 },
  heart: { fontSize: 28, color: '#9090A0' },
  heartActive: { color: '#B3A369' },
  badgeRow: { marginBottom: 14, alignSelf: 'flex-start' },
  card: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  description: { color: '#D0D0E0', fontSize: 15, lineHeight: 22 },
  sectionTitle: { color: '#9090A0', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  barTrack: {
    height: 8,
    backgroundColor: '#2A2A3E',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: { height: '100%', borderRadius: 4 },
  occupancyText: { color: '#9090A0', fontSize: 13 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    backgroundColor: '#2A2A3E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  amenityText: { color: '#F0F0F0', fontSize: 13 },
  timestamp: { color: '#F0F0F0', fontSize: 14 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#13131F',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonCheckin: { backgroundColor: '#B3A369' },
  actionButtonCheckout: { backgroundColor: '#2A2A3E', borderWidth: 1, borderColor: '#E74C3C' },
  actionButtonDisabled: { backgroundColor: '#2A2A3E', opacity: 0.5 },
  actionButtonText: { color: '#F0F0F0', fontWeight: '700', fontSize: 16 },
});
