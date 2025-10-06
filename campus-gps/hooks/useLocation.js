// hooks/useLocation.js
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let subscription = null;

    const getLocation = async () => {
      try {
        setStatus('loading');
        const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
        if (permissionStatus !== 'granted') {
          setError('Location permission denied');
          setStatus('error');
          return;
        }

        const locationData = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          maximumAge: 10000,
        });

        setLocation({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          accuracy: locationData.coords.accuracy,
        });
        setStatus('success');
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to get location');
        setStatus('error');
        console.error('Location error:', err);
      }
    };

    getLocation();

    // start watching position and keep the subscription so we can remove it on cleanup
    const startWatch = async () => {
      try {
        const sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
          (locationData) => {
            setLocation({
              latitude: locationData.coords.latitude,
              longitude: locationData.coords.longitude,
              accuracy: locationData.coords.accuracy,
            });
          }
        );
        subscription = sub;
      } catch (watchErr) {
        console.error('watchPositionAsync error:', watchErr);
      }
    };

    startWatch();

    return () => {
      // subscription returned by watchPositionAsync has a remove method
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  return { location, error, status, isLoading: status === 'loading', hasPermission: status === 'success' };
};