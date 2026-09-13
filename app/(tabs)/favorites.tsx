import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSpots } from '../../hooks/useSpots';
import { useAuth } from '../../hooks/useAuth';
import { SpotCard } from '../../components/SpotCard';
import { toggleFavorite } from '../../firebase/db';

export default function FavoritesScreen() {
  const { spots, loading } = useSpots();
  const { firebaseUser, appUser } = useAuth();

  const favorites = spots.filter((s) => appUser?.favoriteSpots.includes(s.id));

  async function handleToggleFavorite(spotId: string) {
    if (!firebaseUser || !appUser) return;
    const isFav = appUser.favoriteSpots.includes(spotId);
    await toggleFavorite(firebaseUser.uid, spotId, isFav);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Spots</Text>
        <Text style={styles.subtitle}>{favorites.length} saved</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#B3A369" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <SpotCard
              spot={item}
              isFavorite
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>♡</Text>
              <Text style={styles.emptyText}>No saved spots yet.</Text>
              <Text style={styles.emptyHint}>Tap the heart on any spot to save it.</Text>
            </View>
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
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, color: '#B3A369', marginBottom: 12 },
  emptyText: { color: '#F0F0F0', fontSize: 17, fontWeight: '600', marginBottom: 6 },
  emptyHint: { color: '#9090A0', fontSize: 14 },
});
