import React, { useState, useEffect, useRef } from 'react'; // Import useRef for managing focus
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, getDoc, doc } from '../firebaseconfig';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height) * 0.35;
const baseWidth = 375;
const scaleFactor = width / baseWidth;
const baseHeight = 667;
const scaleFactorWidth = width / baseWidth;
const scaleFactorHeight = height / baseHeight;


const SignInPage = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInputRef = useRef(null); // Ref for password field


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPassword('');  // Clear password field
    });

    return unsubscribe; // Clean up the listener on component unmount
  }, [navigation]);

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter both email and password.',
      });
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const userId = userCredential.user.uid;

      try {
        // Check if there's a document in the MobileUser collection with the matching user ID
        const userDocRef = doc(db, 'MobileUser', userId);
        const userDoc = await getDoc(userDocRef);
        console.log('test'+userId)

        if (userDoc.exists()) {
          // User is allowed to log in
          Toast.show({
            type: 'success',
            text1: 'Login Success',
            visibilityTime: 1000,
          });

          setTimeout(() => {
            navigation.navigate('dash'); // Navigate after showing the notification
          }, 1000);
        } else {
          // User account doesn't exist in MobileUser collection
          Toast.show({
            type: 'error',
            text1: 'Login Denied',
            text2: 'Your account is not authorized to log in.',
          });

          // Sign the user out
          auth.signOut();
        }
      } catch (error) {
        // Handle Firestore-related errors
        console.error('Error checking user document:', userId);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An error occurred while verifying your account.',
        });
      }
    })
    .catch((error) => {
      setError(error.code);
      const errorCode = error.code;

      if (errorCode === "auth/missing-password") {
        Toast.show({
          type: 'warning',
          text1: 'Missing Password',
          text2: 'Please provide a password to continue.',
        });
      } else if (errorCode === "auth/user-not-found") {
        Toast.show({
          type: 'error',
          text1: 'User Not Found',
          text2: 'No user found with this email. Please sign up first.',
        });
      } else if (errorCode === "auth/invalid-credential") {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Invalid email address and Password.',
        });
      } else if (errorCode === "auth/invalid-email") {
        Toast.show({
          type: 'error',
          text1: 'Invalid Email',
          text2: 'Please enter a valid email address.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An unexpected error occurred. Please try again later.',
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <AntDesign name="arrowleft" size={45} color="white" style={styles.icon} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image source={require('../assets/image/full_logo_TP_White.png')} style={styles.logo} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={email}
          onChangeText={setUsername}
          returnKeyType="next" // Adds "Next" button to keyboard
          onSubmitEditing={() => passwordInputRef.current.focus()} // Move focus to password
        />

        <Text style={styles.label}>Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordInputRef} // Attach ref to password input
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            returnKeyType="done" // Adds "Done" button to keyboard
            onSubmitEditing={handleLogin} // Trigger login on "Done"
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={30} color="#191970" />
          </TouchableOpacity>
        </View>

        <Pressable
          style={[styles.loginButton, { backgroundColor: isPressed ? '#fff' : '#191970' }]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={handleLogin}>
          <Text style={[styles.loginText, { color: isPressed ? '#191970' : '#fff' }]}>Login</Text>
        </Pressable>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the sign-in page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7AB2D3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25 * scaleFactorWidth,
  },
  backButton: {
    position: 'absolute',
    top: '9%',
    left: '8%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30 * scaleFactorHeight,
  },
  logo: {
    width: width * 0.97,
    height: height * 0.2,
    resizeMode: 'contain',
    marginTop: '40%',
  },
  formContainer: {
    width: '100%',
    height: '55%',
  },
  label: {
    fontSize: 16 * scaleFactor,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 3 * scaleFactorHeight,
    marginBottom: 5 * scaleFactorHeight,
    marginLeft: 14 * scaleFactorWidth,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 15 * scaleFactorWidth,
    paddingVertical: 10 * scaleFactorHeight,
    paddingHorizontal: 15 * scaleFactorWidth,
    fontSize: 16 * scaleFactorHeight,
    marginTop: 5 * scaleFactorHeight,
    marginBottom: 20 * scaleFactorHeight,
    borderWidth: 1,
    borderColor: "#4A628A",
    color: "#191970"
  },
  loginButton: {
    backgroundColor: '#000080',
    borderRadius: 30 * scaleFactorWidth,
    paddingVertical: 15 * scaleFactorHeight,
    paddingHorizontal: 40 * scaleFactorWidth,
    alignItems: 'center',
    marginTop: 15 * scaleFactorHeight,
    marginBottom: 10 * scaleFactorHeight,
    marginHorizontal: 20 * scaleFactorWidth,
    borderWidth:2,
    borderColor:"#191970"
  },
  loginText: {
    color: '#fff',
    fontSize: 28 * scaleFactorWidth,
    fontWeight: 'bold',
    letterSpacing:2,
  },
  forgotText: {
    color: '#fff',
    fontSize: 20 * scaleFactor,
    textAlign: 'center',
    marginTop: 10 * scaleFactorHeight,
    fontWeight: 'bold',
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 2, 
    letterSpacing:1

  },
  errorContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    top: '100%',
  },
  errorText: {
    color: 'red',
  },
  icon:{
  textShadowColor: '#191970',        // Shadow color
  textShadowOffset: { width: 3, height: 3 }, // Shadow offset
  textShadowRadius: 2, 
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 40 * scaleFactorWidth, // Add padding to avoid overlap with icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 17 * scaleFactorWidth,
    top: '20%',
  },
});

export default SignInPage;
