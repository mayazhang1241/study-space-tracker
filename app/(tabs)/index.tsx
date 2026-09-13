import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useSpots } from '../../hooks/useSpots';
import { useAuth } from '../../hooks/useAuth';
import { SpotCard } from '../../components/SpotCard';
import { toggleFavorite } from '../../firebase/db';

export default function SpotsScreen() {
  const { spots, loading } = useSpots();
  const { firebaseUser, appUser } = useAuth();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'available'>('all');

  const filtered = spots.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.building.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || s.isAvailable;
    return matchesQuery && matchesFilter;
  });

  async function handleToggleFavorite(spotId: string) {
    if (!firebaseUser || !appUser) return;
    const isFav = appUser.favoriteSpots.includes(spotId);
    await toggleFavorite(firebaseUser.uid, spotId, isFav);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Spots</Text>
        <Text style={styles.subtitle}>Georgia Tech</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search spots or buildings..."
          placeholderTextColor="#9090A0"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.filterRow}>
        {(['all', 'available'] as const).map((f) => (
          <View
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text
              style={[styles.filterText, filter === f && styles.filterTextActive]}
              onPress={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : 'Available only'}
            </Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#B3A369" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <SpotCard
              spot={item}
              isFavorite={appUser?.favoriteSpots.includes(item.id) ?? false}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No spots match your search.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13131F' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  title: { color: '#B3A369', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#9090A0', fontSize: 13, marginTop: 2 },
  searchRow: { paddingHorizontal: 16, marginTop: 12 },
  searchInput: {
    backgroundColor: '#1E1E2E',
    color: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    gap: 8,
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#1E1E2E',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  filterChipActive: { backgroundColor: '#B3A369', borderColor: '#B3A369' },
  filterText: { color: '#9090A0', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#13131F' },
  empty: {
    color: '#9090A0',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});
