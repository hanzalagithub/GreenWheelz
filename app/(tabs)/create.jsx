import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const create = () => {
  const handleEmail = () => {
    Linking.openURL('mailto:support@greenwheelz.com');
  };

  const handlePhoneCall = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Green Wheelz</Text>
        <Text style={styles.subHeader}>Customer Support</Text>

        <Text style={styles.purpose}>
          Our mission is to assist you with any inquiries or issues related to your ride experience. Reach out to us via phone, email, or visit us at our office.
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Phone:</Text>
          <TouchableOpacity onPress={handlePhoneCall}>
            <Text style={styles.link}>+1 234 567 890</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <TouchableOpacity onPress={handleEmail}>
            <Text style={styles.link}>support@greenwheelz.com</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.address}>123 Green Street, Wheelz City, GW 12345</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  purpose: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  link: {
    fontSize: 16,
    color: '#6772e5',
  },
  address: {
    flex: 1,
    flexWrap: 'wrap',   // Ensures that the text wraps within the container
    color: '#333',
    paddingLeft:7,
  }
});

export default create;
