import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Mapp from "../../components/Mapp";
import QrScanner from "../../components/QrScanner"; // Import the QrScanner component
import { images } from "../../constants";

const Home = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleOpenScanner = () => {
    setIsScannerOpen(true);
  };

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Conditionally render the QrScanner component */}
      {isScannerOpen ? (
        <QrScanner onClose={handleCloseScanner} />
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6">
              <View className="flex justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-black">Welcome Back</Text>
                  <Text className="text-2xl font-psemibold text-green-800">GreenWheelZ</Text>
                </View>
                <View>
                  <Image
                    source={images.greenlogo}
                    style={{ width: 100, height: 70 }} // Adjust the width and height as needed
                  />
                </View>
              </View>
              <View className="h-64">
                <Mapp />
              </View>
              <TouchableOpacity style={styles.scanButton} onPress={handleOpenScanner}>
                <Text style={styles.scanButtonText}>Quick Scan</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: "green", // Dodger Blue color
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20, // Add margin from the top
  },
  scanButtonText: {
    color: "#ffffff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
