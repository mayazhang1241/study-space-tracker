import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StudySpot } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';

interface Props {
  spot: StudySpot;
  isFavorite: boolean;
  onToggleFavorite: (spotId: string) => void;
}

export function SpotCard({ spot, isFavorite, onToggleFavorite }: Props) {
  const router = useRouter();

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
          <Text style={styles.heart}>{isFavorite ? '♥' : '♡'}</Text>
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
  heart: { fontSize: 22, color: '#B3A369' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amenities: { color: '#9090A0', fontSize: 12, flex: 1, marginRight: 8 },
});
