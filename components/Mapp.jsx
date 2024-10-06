import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';

const bikeMarker = require('../assets/icons/bike.png');
const parkingIcon = require('../assets/icons/parking.webp'); // Use your custom parking station icon

export default function Mapp() {
  const [bikeLocation, setBikeLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 31.5025,
    longitude: 74.3054,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedParking, setSelectedParking] = useState(null);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const router = useRouter();
  const esp32IpAddress = 'http://192.168.43.161/get-gps';

  useEffect(() => {
    const fetchBikeLocation = async () => {
      try {
        const response = await fetch(esp32IpAddress);
        const data = await response.json();
        console.log('Fetched data:', data);

        if (data && data.latitude && data.longitude) {
          const bikeCoords = {
            latitude: data.latitude,
            longitude: data.longitude,
          };
          setBikeLocation(bikeCoords);
        } else {
          console.error('No valid data found:', data);
        }
      } catch (error) {
        console.error('Error fetching bike location:', error);
      }
    };

    fetchBikeLocation();
    const intervalId = setInterval(fetchBikeLocation, 6000);

    return () => clearInterval(intervalId);
  }, []);

  const parkingLocations = [
    { title: 'Chep', latitude: 31.5025, longitude: 74.3054 },
    { title: 'Chemical', latitude: 31.500823, longitude: 74.305410 },
    { title: 'Vc office parking', latitude: 31.503837, longitude: 74.306518 },
    { title: 'Hbl parking', latitude: 31.503292, longitude: 74.307133 },
    { title: 'IER parking', latitude: 31.504070, longitude: 74.308472 },
    { title: 'Hailey clg', latitude: 31.497164, longitude: 74.303979 },
  ];

  const handlePickerChange = (itemValue) => {
    const selectedLocation = parkingLocations.find(location => location.title === itemValue);
    setSelectedParking(selectedLocation);
    setIsScannerVisible(true); // Show the QR scanner button after selecting parking

    if (selectedLocation) {
      setMapRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleOpenQrScanner = () => {
    if (selectedParking) {
      // Redirect to QR scanner screen with the selected parking location
      router.push({
        pathname: '/QrScanner',
        params: { selectedParking: JSON.stringify(selectedParking) },
      });
    } else {
      alert('Please select a parking station first.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
      >
        {bikeLocation && (
          <Marker
            coordinate={bikeLocation}
            title="Bike Location"
            description="Current location of the bike"
          >
            <Image
              source={bikeMarker}
              style={styles.bikeMarker}
            />
          </Marker>
        )}

        {parkingLocations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
            description={`${location.title} parking station`}
          >
            <Image
              source={parkingIcon}
              style={styles.parkingMarker}
            />
          </Marker>
        ))}
      </MapView>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedParking ? selectedParking.title : null}
          style={styles.picker}
          onValueChange={handlePickerChange}
          prompt="Select a parking station"
        >
          <Picker.Item label="No parking station selected" value={null} />
          {parkingLocations.map((location, index) => (
            <Picker.Item key={index} label={location.title} value={location.title} />
          ))}
        </Picker>
      </View>

      {/* QR Scanner Button */}
      {isScannerVisible && (
        <View style={styles.qrButtonContainer}>
          <TouchableOpacity style={styles.qrButton} onPress={handleOpenQrScanner}>
            <Text style={styles.qrButtonText}>Open QR Scanner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pickerContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  bikeMarker: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  parkingMarker: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
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
    paddingHorizontal: 30,
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
