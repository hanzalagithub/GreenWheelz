import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { getCurrentUser, getRideHistory } from '../../lib/appwrite';

const Bookmark = () => {
  const [rideHistory, setRideHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = await getCurrentUser();
      if (user) {
        const history = await getRideHistory(user.$id);
        setRideHistory(history);
      }
    };
    fetchHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>Destination:</Text>
      <Text style={styles.text}>{item.destination}</Text>
      <Text style={styles.title}>Date:</Text>
      <Text style={styles.text}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.title}>Distance:</Text>
      <Text style={styles.text}>{item.distanceTraveled} km</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rideHistory}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});

export default Bookmark;
