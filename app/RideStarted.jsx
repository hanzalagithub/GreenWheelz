import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const RideStarted = () => {
  const { qrCode } = useLocalSearchParams();
  const router = useRouter();

  const handleCancelRide = () => {
    // Navigate back to the home page
    router.push({ pathname: '/' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Ride has been started!</Text>
      <Text style={styles.qrCode}>QR Code: {qrCode}</Text>
      <Button title="Cancel Ride" onPress={handleCancelRide} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  qrCode: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default RideStarted;
