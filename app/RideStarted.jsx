import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getDistance } from 'geolib'; // Install geolib if not already
import { saveRideHistory, getCurrentUser } from '../lib/appwrite';

const ESP32_IP = "http://192.168.43.161"; // Replace with your ESP32 IP

const bikeMarker = require('../assets/icons/bike.png');
const parkingIcon = require('../assets/icons/parking.webp');

export default function RideStarted() {
  const [bikeLocation, setBikeLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [route, setRoute] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);

  const router = useRouter();
  const { selectedParking } = useLocalSearchParams(); // Retrieve parameters

  useEffect(() => {
    if (selectedParking) {
      const parsedParking = JSON.parse(selectedParking);
      setDestination({
        latitude: parsedParking.latitude,
        longitude: parsedParking.longitude,
      });
      if (bikeLocation) {
        setInitialRegion({
          latitude: (parsedParking.latitude + bikeLocation.latitude) / 2,
          longitude: (parsedParking.longitude + bikeLocation.longitude) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    }
  }, [selectedParking, bikeLocation]);

  useEffect(() => {
    const fetchBikeLocation = async () => {
      try {
        const response = await fetch(`${ESP32_IP}/get-gps`);
        const data = await response.json();
        console.log('Fetched bike location data:', data);

        if (data && data.latitude && data.longitude) {
          const bikeCoords = {
            latitude: data.latitude,
            longitude: data.longitude,
          };
          setBikeLocation(bikeCoords);
          if (destination) {
            setRoute([bikeCoords, destination]);
            const distance = getDistance(bikeCoords, destination);
            setDistanceTraveled(distance / 1000); // Distance in kilometers
          }
        } else {
          console.error('No valid data found:', data);
        }
      } catch (error) {
        console.error('Error fetching bike location:', error);
      }
    };

    fetchBikeLocation();
    const intervalId = setInterval(fetchBikeLocation, 6000); // Fetch every 1 minute

    return () => clearInterval(intervalId);
  }, []);

  const lockBike = async () => {
    try {
      const response = await fetch(`${ESP32_IP}/lock`, { method: 'POST' });
      const result = await response.text();
      if (result === 'Locked') {
        Alert.alert('Bike Locked', 'Your ride has ended.');
        return true;
      } else {
        Alert.alert('Error', 'Failed to lock the bike');
        return false;
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to communicate with the bike lock');
      return false;
    }
  };

  const endRide = async () => {
    const baseCharge = 5; // Basic amount in dollars
    const chargePerKm = 2; // Example rate per kilometer
    const totalCharge = baseCharge + (distanceTraveled * chargePerKm);

    Alert.alert(`Ride ended! You were charged $${totalCharge.toFixed(2)} for ${distanceTraveled.toFixed(2)} kilometers.`);

    const locked = await lockBike();
    if (locked) {
       // Save ride history
       try{

         const user = await getCurrentUser(); // Get the current user
         const rideData = await saveRideHistory(user.$id, destination, distanceTraveled);
         console.log('Ride saved:', rideData);
         router.push({ pathname: '/', params: { totalCharge } });
        } catch (error){
          console.error('Error saving ride history:', error);

        }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Ride in progress...</Text>
      {bikeLocation && destination && initialRegion ? (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          region={initialRegion}
        >
          <Marker coordinate={bikeLocation} title="Bike Location">
          <Image source={bikeMarker} style={styles.markerIcon} />
          </Marker>
          <Marker coordinate={destination} title="destination">
            <Image source={parkingIcon} style={styles.markerIcon} />
          </Marker>
          {route.length === 2 && (
            <Polyline
              coordinates={route}
              strokeColor="blue"
              strokeWidth={3}
            />
          )}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Loading map...</Text>
      )}
      <View style={styles.qrButtonContainer}>

          <TouchableOpacity style={styles.qrButton} onPress={endRide}>
              <Text style={styles.qrButtonText}>End the Ride</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '80%', // Adjust height to make space for the button
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  markerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain', // Ensure the icon fits within the marker
  },
  qrButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  qrButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
