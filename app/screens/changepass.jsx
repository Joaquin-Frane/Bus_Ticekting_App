import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { auth } from '../firebaseconfig'; // Import your auth instance
import { sendPasswordResetEmail } from 'firebase/auth';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height) * 0.35;
const baseWidth = 375;
const scaleFactor = width / baseWidth;
const baseHeight = 667;
const scaleFactorWidth = width / baseWidth;
const scaleFactorHeight = height / baseHeight;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);


  const handlePasswordReset = async () => {
    try {
      // Use the auth instance imported from firebaseconfig
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! \n Check your inbox.');
      setError(''); // Clear any previous errors
    } catch (error) {
      setError(error.message);
      setMessage(''); // Clear any previous messages
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton}  onPress={() => {
    console.log("Back button pressed");
    navigation.navigate("SignIn");
  }}>
        <AntDesign name="arrowleft" size={50 * scaleFactor} color="white"  style={styles.icon}/>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        
        autoCapitalize="none"
      />
      <Pressable  onPress={handlePasswordReset} style={[styles.Button, {backgroundColor: isPressed ? '#fff' : '#6eacda' }]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}>

        <Text style={[styles.btext, { color: isPressed ? '#191970' : '#fff' }]}>Send Password Reset Email</Text>

      </Pressable>

      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    paddingTop:"10%",
    backgroundColor:"#191970",
    paddingHorizontal:"5%"
  },
  title: {paddingTop:"40%",
    fontSize: 30,
    fontWeight:"bold",
    marginBottom: "20%",
    textAlign: 'center',
    color:'#fff',
    textShadowColor: '#000',        // Shadow color
    textShadowOffset: { width: 3, height: 3 }, // Shadow offset
    textShadowRadius: 2, 
    letterSpacing:2
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal:"5%",
    backgroundColor:"#fff",
    fontSize:18,
    color:"#191970",

    
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginVertical: "10%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    fontSize:16,
    letterSpacing:1,
    fontWeight:"500"

  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: "10%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    fontSize:16,
    letterSpacing:1,
    fontWeight:"500"
  },
  Button:{
    marginBottom: 16,
    borderRadius: 30,
    marginHorizontal:"12%",
    backgroundColor: "#6eacda",
    marginVertical: 20,
    paddingHorizontal:15
  },
  btext:{
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
    color:'#fff',
    fontWeight:"bold",

  },
  backButton: {
    padding: 10, // Add padding for a larger touch area
    alignSelf: 'flex-start',
  },
  icon:{
    textShadowColor: '#000',        // Shadow color
    textShadowOffset: { width: 3, height: 3 }, // Shadow offset
    textShadowRadius: 2, 
    
    }

});

export default ForgotPassword;
