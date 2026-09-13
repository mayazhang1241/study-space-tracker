import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useSpots } from '../../hooks/useSpots';

const GT_CENTER = { latitude: 33.7756, longitude: -84.3963, latitudeDelta: 0.012, longitudeDelta: 0.012 };

export default function MapScreen() {
  const { spots, loading } = useSpots();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Campus Map</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#B3A369" style={{ marginTop: 40 }} />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={GT_CENTER}
          userInterfaceStyle="dark"
          showsUserLocation
        >
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{ latitude: spot.lat, longitude: spot.lng }}
              pinColor={spot.isAvailable ? '#2ECC71' : '#E74C3C'}
              onPress={() => setSelected(spot.id)}
            >
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutName}>{spot.name}</Text>
                  <Text style={styles.calloutSub}>
                    {spot.currentOccupancy}/{spot.capacity} occupied
                  </Text>
                  <Text style={[styles.calloutStatus, { color: spot.isAvailable ? '#2ECC71' : '#E74C3C' }]}>
                    {spot.isAvailable ? 'Available' : 'Full'}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13131F' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { color: '#B3A369', fontSize: 24, fontWeight: '800' },
  map: { flex: 1 },
  callout: {
    backgroundColor: '#1E1E2E',
    borderRadius: 10,
    padding: 12,
    minWidth: 160,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  calloutName: { color: '#F0F0F0', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  calloutSub: { color: '#9090A0', fontSize: 12, marginBottom: 4 },
  calloutStatus: { fontWeight: '700', fontSize: 13 },
});
