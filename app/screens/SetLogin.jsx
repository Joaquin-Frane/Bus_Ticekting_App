import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Pressable} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

// Get the screen dimensions
const { width, height } = Dimensions.get('window');
// Choose the smaller value (width or height) for square sizing
const squareSize = Math.min(width, height) * 0.65;

// Define a base size (you can adjust this to suit your design)
const baseWidth = 375; // Use the width of a common device like iPhone 11
const scaleFactor = width / baseWidth; // Scale factor based on screen width


const LoginPage = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);

  const navigation=useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/image/fron_Db.png')}  // Replace with your logo path
          style={styles.logo}
        />  
      </View>

      {/* Gradient Background */}
      <LinearGradient 
        colors={['#ffffff', '#303f9f']} 
        style={styles.gradientBackground}
      >
        {/* Login Button */}
        <Pressable style={[styles.loginButton, { backgroundColor: isPressed ? '#6eacda' : '#191970' }]} 
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={() =>navigation.navigate('SignIn')}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>

        <Pressable style={[styles.signupButton, { backgroundColor: isPressed1 ? '#ccc' : '#fff' }]} 
          onPressIn={() => setIsPressed1(true)}
          onPressOut={() => setIsPressed1(false)}
          onPress={() =>navigation.navigate('SignUp')}>
          <Text style={[styles.signupText, { color: isPressed1 ? '#fff' : '#4682B4' }]}>Sign Up</Text>
        </Pressable>

      </LinearGradient>
    </View>
    </SafeAreaView>
  );
};

// Styles for the login page
const styles = StyleSheet.create({
  safe:{
    flex:1,
    justifyContent:"center",
    backgroundColor: "#fff"
  },
  container: {
    paddingTop: "10%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    marginTop: '25%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: squareSize, 
    height: squareSize,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30 * scaleFactor,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14 * scaleFactor,
    color: '#666',
    marginTop: 5,
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loginButton: {
    backgroundColor: '#191970',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginVertical: "5%",
    width: '80%',
    height:'23%',
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginVertical: '5%',
    width: '80%',
    height:'23%',
    alignItems: 'center',
    marginBottom: 100,
    

  },
  loginText: {
    color: '#fff',
    fontSize: 30 * scaleFactor,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#191970',
    fontSize: 30 * scaleFactor,
    fontWeight: 'bold',
  },
});

export default LoginPage;
