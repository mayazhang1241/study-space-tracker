import { View, Text, StyleSheet } from 'react-native';

interface Props {
  isAvailable: boolean;
  currentOccupancy: number;
  capacity: number;
}

export function AvailabilityBadge({ isAvailable, currentOccupancy, capacity }: Props) {
  const pct = Math.round((currentOccupancy / capacity) * 100);
  const label = isAvailable ? (pct > 60 ? 'Getting full' : 'Available') : 'Full';
  const color = isAvailable ? (pct > 60 ? '#E6A817' : '#2ECC71') : '#E74C3C';

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.count}>
        {currentOccupancy}/{capacity}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  count: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.9,
  },
});
