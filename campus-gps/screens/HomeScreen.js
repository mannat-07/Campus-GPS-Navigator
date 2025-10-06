// screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleOpenMap = () => {
    navigation.navigate('Map');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🏫 Campus GPS</Text>
          <Text style={styles.subtitle}>Navigate your campus effortlessly</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>27</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>11</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        <CustomButton
          title="🗺️ Open Campus Map"
          onPress={handleOpenMap}
          style={styles.mainButton}
        />

        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickButton, styles.nearestButton]}>
            <Text style={styles.quickButtonText}>📍 Find Nearest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickButton, styles.searchButton]}>
            <Text style={styles.quickButtonText}>🔍 Search Building</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Based on your campus layout</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 22 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  statCard: {
    backgroundColor: 'white', padding: 20, borderRadius: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3, minWidth: 80,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  mainButton: { marginBottom: 20 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  quickButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5, elevation: 2 },
  nearestButton: { backgroundColor: '#10b981' },
  searchButton: { backgroundColor: '#3b82f6' },
  quickButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  footer: { fontSize: 12, color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' },
});