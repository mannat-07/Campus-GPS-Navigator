import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function SearchScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.inner}>
				<Text style={styles.title}>Search</Text>
				<Text style={styles.subtitle}>Search functionality will be added here.</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
	title: { fontSize: 20, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
	subtitle: { fontSize: 14, color: '#64748b' },
});
