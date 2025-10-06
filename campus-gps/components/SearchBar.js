import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
	return (
		<View style={styles.container}>
			<TextInput
				value={value}
				onChangeText={onChange}
				placeholder={placeholder}
				style={styles.input}
				autoCapitalize="none"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { width: '100%' },
	input: { backgroundColor: '#f1f5f9', padding: 10, borderRadius: 8, fontSize: 16 },
});
