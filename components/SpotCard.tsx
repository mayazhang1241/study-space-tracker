import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StudySpot } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';

/**
 * Formats the occupancy timestamp for the list view.
 *
 * A relative time is more useful than a clock time here: scanning a list, what matters
 * is whether a number is fresh, not what o'clock it was recorded. Past an hour the
 * relative form stops being informative ("Updated 143 min ago"), so it falls back to
 * the same clock format the spot detail screen uses.
 *
 * The `instanceof Date` guard matches the detail screen — a Firestore Timestamp that
 * hasn't been converted would otherwise throw here.
 */
function formatLastUpdated(lastUpdated: StudySpot['lastUpdated']): string | null {
  if (!(lastUpdated instanceof Date) || Number.isNaN(lastUpdated.getTime())) return null;

  const minutes = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);

  // A negative value means a clock skew between the device and the server; treat it as
  // fresh rather than showing "Updated -3 min ago".
  if (minutes < 1) return 'Updated just now';
  if (minutes === 1) return 'Updated 1 min ago';
  if (minutes < 60) return `Updated ${minutes} min ago`;

  return `Updated at ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

interface Props {
  spot: StudySpot;
  isFavorite: boolean;
  onToggleFavorite: (spotId: string) => void;
}

export function SpotCard({ spot, isFavorite, onToggleFavorite }: Props) {
  const router = useRouter();
  const lastUpdatedLabel = formatLastUpdated(spot.lastUpdated);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/spot/${spot.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.name}>{spot.name}</Text>
          <Text style={styles.building}>{spot.building} · {spot.floor} floor</Text>
        </View>
        <TouchableOpacity onPress={() => onToggleFavorite(spot.id)} hitSlop={8}>
          <Text style={[styles.heart, isFavorite && styles.heartActive]}>{isFavorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.amenities}>{spot.amenities.slice(0, 3).join(' · ')}</Text>
        <AvailabilityBadge
          isAvailable={spot.isAvailable}
          currentOccupancy={spot.currentOccupancy}
          capacity={spot.capacity}
        />
      </View>

      {lastUpdatedLabel && <Text style={styles.lastUpdated}>{lastUpdatedLabel}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleBlock: { flex: 1, marginRight: 8 },
  name: { color: '#F0F0F0', fontSize: 16, fontWeight: '700' },
  building: { color: '#9090A0', fontSize: 13, marginTop: 2 },
  heart: { fontSize: 22, color: '#9090A0' },
  heartActive: { color: '#B3A369' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amenities: { color: '#9090A0', fontSize: 12, flex: 1, marginRight: 8 },
  lastUpdated: { color: '#6A6A7A', fontSize: 11, marginTop: 8 },
});
