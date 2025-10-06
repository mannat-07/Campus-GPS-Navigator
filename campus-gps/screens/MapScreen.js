// screens/MapScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Dimensions, ScrollView, Platform } from 'react-native';
// IMPORTANT: Avoid static import of react-native-maps to prevent web runtime errors
// We'll require it dynamically only on native platforms.
import { TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import CustomButton from '../components/CustomButton';
import { campusLocations, categories } from '../data/locations';
import { useLocation } from '../hooks/useLocation';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapScreen() {
  // Dynamically load react-native-maps only on native platforms
  const Maps = useMemo(() => {
    if (Platform.OS === 'web') return null;
    try {
      const RNM = require('react-native-maps');
      return {
        MapView: RNM.default,
        Marker: RNM.Marker,
        PROVIDER_GOOGLE: RNM.PROVIDER_GOOGLE,
      };
    } catch (e) {
      console.warn('react-native-maps not available:', e?.message);
      return null;
    }
  }, []);
  const [region, setRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: LATITUDE_DELTA * 4,
    longitudeDelta: LONGITUDE_DELTA * 4,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredLocations, setFilteredLocations] = useState(campusLocations);
  const [userLocation, setUserLocation] = useState(null);
  const [showHelpdesks, setShowHelpdesks] = useState(false);
  const { location, error } = useLocation();

  useEffect(() => {
    if (location) {
      setUserLocation(location);
      setRegion(prev => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    }
  }, [location]);

  useEffect(() => {
    let filtered = campusLocations;
    if (selectedCategory !== 'all') filtered = filtered.filter(loc => loc.category === selectedCategory);
    if (searchQuery) filtered = filtered.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredLocations(filtered);
    if (filtered.length === 1) {
      const { lat, lng } = filtered[0];
      setRegion(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA * 2,
        longitudeDelta: LONGITUDE_DELTA * 2,
      }));
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (error) console.warn('Location error:', error);
  }, [error]);

  const handleLocationPress = () => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: LATITUDE_DELTA * 2,
        longitudeDelta: LONGITUDE_DELTA * 2,
      });
    }
  };

  const getMarkerColor = (category) => ({
    academic: '#2196F3',
    hostel: '#FF9800',
    food: '#4CAF50',
    admin: '#9C27B0',
    green: '#8BC34A',
    entrance: '#F44336',
    laboratory: '#00BCD4',
    auditorium: '#E91E63',
    bank: '#795548',
    garden: '#FFC107',
    helpdesk: '#607D8B',
  }[category] || '#666');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search buildings (e.g., Nightingale Block)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        <View style={styles.controlButtons}>
          <CustomButton
            title="📍 My Location"
            onPress={handleLocationPress}
            style={[styles.smallButton, userLocation ? styles.activeButton : null]}
          />
          <CustomButton
            title={showHelpdesks ? '🙈 Hide Helpdesks' : '❓ Show Helpdesks'}
            onPress={() => setShowHelpdesks(!showHelpdesks)}
            style={styles.smallButton}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, selectedCategory === category.id && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[styles.categoryIcon, { color: selectedCategory === category.id ? category.color : '#94a3b8' }]}>
              {category.icon}
            </Text>
            <Text style={[styles.categoryText, selectedCategory === category.id && { color: category.color }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {Platform.OS === 'web' || !Maps ? (
        <View style={[styles.map, styles.webMapFallback]}>
          <Text style={styles.webMapText}>
            Map preview isn’t available on Web with react-native-maps. Open the app on a device or emulator.
          </Text>
        </View>
      ) : (
        <Maps.MapView
          provider={Maps.PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          toolbarEnabled={false}
          loadingEnabled={true}
        >
          {filteredLocations.map((location) => {
            if (location.category === 'helpdesk' && !showHelpdesks) return null;
            return (
              <Maps.Marker
                key={location.id}
                coordinate={{ latitude: location.lat, longitude: location.lng }}
                title={location.name}
                description={location.description}
                pinColor={getMarkerColor(location.category)}
                onPress={() => {
                  setRegion({
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: LATITUDE_DELTA * 1.5,
                    longitudeDelta: LONGITUDE_DELTA * 1.5,
                  });
                }}
              />
            );
          })}
          {userLocation && (
            <Maps.Marker
              coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
              title="You are here"
              pinColor="green"
            />
          )}
        </Maps.MapView>
      )}

      <View style={styles.bottomSheet}>
        <Text style={styles.bottomText}>
          {filteredLocations.length} locations found • Tap markers for details
        </Text>
      </View>

      {searchQuery && (
        <View style={styles.searchResults}>
          <Text style={styles.searchCount}>
            {filteredLocations.length} result{filteredLocations.length !== 1 ? 's' : ''} for "{searchQuery}"
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  searchInput: {
    backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  controlButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  smallButton: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 4, borderRadius: 6 },
  activeButton: { backgroundColor: '#10b981' },
  categoryScroll: { maxHeight: 60, backgroundColor: 'white' },
  categoryContainer: { paddingHorizontal: 15, paddingVertical: 10 },
  categoryButton: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, marginRight: 10, borderRadius: 20, backgroundColor: '#f8fafc' },
  selectedCategory: { backgroundColor: '#e2e8f0' },
  categoryIcon: { fontSize: 18, marginBottom: 2 },
  categoryText: { fontSize: 12, fontWeight: '500' },
  map: { flex: 1 },
  webMapFallback: { alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#f8fafc' },
  webMapText: { color: '#64748b', textAlign: 'center' },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: 15, borderTopLeftRadius: 16, borderTopRightRadius: 16, alignItems: 'center' },
  bottomText: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  searchResults: { position: 'absolute', top: 80, left: 15, right: 15, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: 8, borderRadius: 8, alignItems: 'center' },
  searchCount: { fontSize: 14, color: '#1e3a8a', fontWeight: '600' },
});