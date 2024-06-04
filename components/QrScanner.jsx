import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { getStoredQRCode, validateQRCode } from "../lib/appwrite";
import { useRouter } from "expo-router";

export default function QrScanner({ onClose }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [storedQRCode, setStoredQRCode] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    const fetchStoredQRCode = async () => {
      try {
        const response = await getStoredQRCode(); // Fetch the stored QR code from your Appwrite database
        setStoredQRCode(response);
      } catch (error) {
        console.error("Error fetching stored QR code:", error);
        Alert.alert("Error", "Failed to fetch stored QR code");
      }
    };

    getCameraPermissions();
    fetchStoredQRCode();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log("QR Code Data:", data);
    try {
      const isValidQRCode = await validateQRCode(data);
      console.log("Is QR Code Valid?", isValidQRCode);
      if (isValidQRCode && data === storedQRCode) {
        router.push({
          pathname: 'RideStarted',
          params: { qrCode: data }
        });
      } else {
        Alert.alert("Error", "Invalid or unmatched QR code");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      Alert.alert("Error", "Failed to process QR code");
    }
  };
  
  const handleCloseScanner = () => {
    if (onClose) {
      onClose();
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <TouchableOpacity style={styles.closeButton} onPress={handleCloseScanner}>
        <Text style={styles.closeButtonText}>Close Scanner</Text>
      </TouchableOpacity>
      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
  },
  scanAgainButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
