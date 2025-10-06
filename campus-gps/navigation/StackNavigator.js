// Minimal StackNavigator helper - project currently wires navigation in App.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function StackNavigator({ children }) {
	return (
		<Stack.Navigator>
			{children}
		</Stack.Navigator>
	);
}
