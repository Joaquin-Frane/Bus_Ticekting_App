import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AlertMessage = ({ email, onLoginPress }) => {
  return (
    <View style={styles.alertContainer}>
      <Text style={styles.title}>Congratulations !!</Text>
      <View style={styles.divider} />
      <Text style={styles.message}>You are now a Registered user:</Text>
      <Text style={styles.email}>{email}</Text>
      
      <TouchableOpacity style={styles.button} onPress={onLoginPress}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3C3B6E',
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#A9A9A9',
    marginVertical: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3C3B6E',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AlertMessage;
