import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, View, StyleSheet } from "react-native";
import Mapp from "../../components/Mapp";
// import QrScanner from "../QrScanner"; // Import the QrScanner component
import { images } from "../../constants";

const Home = () => {
  // const [isScannerOpen, setIsScannerOpen] = useState(false);

  // const handleOpenScanner = () => {
  //   setIsScannerOpen(true);
  // };

 

  return (
    <SafeAreaView style={styles.container}>
      {/* Conditionally render the QrScanner component
      {isScannerOpen ? (
        <QrScanner onClose={handleCloseScanner} />
      ) : ( */}
        <FlatList
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <View style={styles.welcomeContainer}>
                <View>
                  <Text style={styles.welcomeText}>Welcome Back</Text>
                  <Text style={styles.appTitle}>GreenWheelZ</Text>
                </View>
                <Image
                  source={images.greenlogo}
                  style={styles.logo} // Adjust the width and height as needed
                />
              </View>

              {/* Map container */}
              <View style={styles.mapContainer}>
                <Mapp />
              </View>

              {/* Button container */}
              {/* <TouchableOpacity style={styles.scanButton} onPress={handleOpenScanner}>
                <Text style={styles.scanButtonText}>Quick Scan</Text>
              </TouchableOpacity> */}
            </View>
          )}
        />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "white",
    flex: 1,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20, // Add space below the header section
  },
  welcomeText: {
    fontSize: 14,
    color: "black",
    fontFamily: "sans-serif-medium",
  },
  appTitle: {
    fontSize: 24,
    color: "#228B22", // Green color for the app name
    fontWeight: "600",
  },
  logo: {
    width: 100,
    height: 70, // Adjust the width and height for the logo
    resizeMode: "contain",
  },
  mapContainer: {
    height: 480, // Give the map sufficient height
    marginBottom: 5, // Add space between the map and button
    borderRadius: 10, // Rounded corners for the map
    overflow: "hidden", // Ensures the map fits the rounded container
  },
  scanButton: {
    backgroundColor: "green", // Green background for the button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10, // Add margin from the top
    marginHorizontal: 16, // Align with the padding of the container
  },
  scanButtonText: {
    color: "#ffffff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
