import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ESP32_IP = "http://192.168.43.161";  // Replace with your ESP32 IP

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { selectedParking } = useLocalSearchParams();
  
  // Simulated wallet balance
  const walletBalance = 10; // Assume user has 10 units in the wallet

  const unlockBike = async () => {
    try {
      const response = await fetch(`${ESP32_IP}/unlock`);
      if (response.ok) {
        Alert.alert("Success", "Bike unlocked!");
      } else {
        Alert.alert("Error", "Failed to unlock bike. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to the bike lock.");
    }
  };

  const validateInput = () => {
    const paymentAmount = amount ? parseFloat(amount) : 5; // Default amount to 5

    if (!email || !currency) {
      setErrorMessage('Please fill out all fields.');
      return false;
    }

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setErrorMessage('Amount must be a positive number.');
      return false;
    }

    if (paymentAmount < 5) {
      setErrorMessage('Amount must be at least 5 for security deposit.');
      return false;
    }

    if (walletBalance < paymentAmount) {
      Alert.alert('Insufficient Balance', 'Your wallet balance is not sufficient.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handlePayment = async () => {
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      const paymentAmount = amount ? parseInt(amount) * 100 : 500; // Default amount is 5

      const response = await fetch('https://gold-sheep-ask.loca.lt/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentAmount, // Stripe expects the amount in cents
          currency: currency,
        }),
      });

      const { clientSecret } = await response.json();

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: email,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent) {
        await unlockBike();
        router.push({
          pathname: 'RideStarted',
          params: { selectedParking },
        });
      }
    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Details</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your email"
      />

      <Text style={styles.label}>Amount (Default: 5)</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        placeholder="Enter amount"
      />

      <Text style={styles.label}>Currency</Text>
      <TextInput
        value={currency}
        onChangeText={setCurrency}
        style={styles.input}
        placeholder="Currency (e.g. usd)"
      />

      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.cardField}
        style={styles.cardContainer}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handlePayment}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Processing...' : 'Pay'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardField: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  cardContainer: {
    height: 50,
    marginBottom: 20,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'grey',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#6772e5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default PaymentScreen;
