import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Alert, Pressable, Modal } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, setDoc, doc } from '../firebaseconfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

// Get the screen dimensions
const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height) * 0.35;

// Define a base size for scaling
const baseWidth = 375;
const scaleFactorWidth = width / baseWidth;
const baseHeight = 667;
const scaleFactorHeight = height / baseHeight;

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);

  // For input border color
  const [borderColors, setBorderColors] = useState({
    firstName: '#f3f3f3',
    lastName: '#f3f3f3',
    birthDate: '#f3f3f3',
    phone: '#f3f3f3',
    email: '#f3f3f3',
    password: '#f3f3f3',
  });

  const navigation = useNavigation();

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Close the calendar after selection
    if (selectedDate) {
      // Format the selected date as MM/DD/YYYY
      const formattedDate = `${
        (selectedDate.getMonth() + 1).toString().padStart(2, '0')
      }/${selectedDate.getDate().toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
      setBirthDate(formattedDate);
      setBorderColors({ ...borderColors, birthDate: '#f3f3f3' });
    }
  };

  const signUpUser = async () => {
    if (!firstName || !lastName || !birthDate || !phone || !email || !password) {
      // Highlight the empty fields
      setBorderColors({
        firstName: firstName ? '#f3f3f3' : 'red',
        lastName: lastName ? '#f3f3f3' : 'red',
        birthDate: birthDate ? '#f3f3f3' : 'red',
        phone: phone ? '#f3f3f3' : 'red',
        email: email ? '#f3f3f3' : 'red',
        password: password ? '#f3f3f3' : 'red',
      });

      // Show a toast notification
      Toast.show({
        type: 'warning',
        text1: 'Missing Fields',
        text2: 'Please fill all the fields before submitting.',
      });

      return; // Stop further execution
    }
    if (password.length < 8) {
      // Show a toast if password is too short
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Your password should be longer than 8 characters.',
      });
      setBorderColors({
        ...borderColors,
        password: 'red',
      });
      return; // Stop further execution
    }

    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a Firestore document for the user
      await setDoc(doc(db, "MobileUser", user.uid), {
        user_id: user.uid,
        first_name: firstName,
        last_name: lastName,
        email: user.email,
        birthday: birthDate,
        phone: phone,
        reward_points: 0,
        role: 'user',
      });

      // Show modal on successful sign-up
      setModalVisible(true);
      //Alert.alert('CONGRATULATIONS !!', `You are now a Registered user: \n\n ${email}`, [
      //  { text: 'Login', onPress: () => navigation.navigate('SignIn') }
      //]);

    } catch (error) {
      console.log("Error: ", error.message);
      const errorCode = error.code;

    if (errorCode === "auth/missing-password") {
        Toast.show({
        type: 'warning',
        text1: 'Missing Password',
        text2: 'Please provide a password to continue.',
      });
    } else if (errorCode === "auth/invalid-credential") {
        Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Invalid email address and Password.',
      });
    }  else if (errorCode === "auth/invalid-email") {
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
    }
  };

  return (
    <View style={styles.topbar}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <AntDesign name="arrowleft" size={50 * scaleFactorWidth} color="#fff" style={styles.icon}/>
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={require('../assets/image/Title_TP_DarkBule.png')} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.signupContainer}>
        <View style={styles.signupForm}>
          <Text style={styles.formTitle}>Sign Up:</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, { borderColor: borderColors.firstName }]}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, { borderColor: borderColors.lastName }]}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth Date</Text>
          <Pressable onPress={() => setShowDatePicker(true)}>
              
            <Text style={[styles.input2, { color: birthDate ? '#191970' : '#aaa' }, { borderColor: borderColors.birthDate }]}>
              {birthDate || 'MM/DD/YYYY'}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate ? new Date(birthDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()} // Restrict to dates in the past
            />
          )}
        </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, { borderColor: borderColors.phone }]}
              placeholder="0912 345 6789"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: borderColors.email }]}
              placeholder="User@gmail.com"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { borderColor: borderColors.password }]}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#777"
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => { setTimeout(() => {setShowPassword(!showPassword);}, 0); }}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={30}color="grey"/>
              </TouchableOpacity>
            </View>
          </View>

          <Pressable style={[styles.loginButton, {backgroundColor: isPressed ? "#6eacda": "#191970"}]} 
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={signUpUser}>
            <Text style={[styles.loginText, ]}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal for successful sign-up */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>CONGRATULATIONS!!</Text>
            <Text style={styles.modalMessage1}>You are now a registered user:</Text>
            <Text style={styles.modalMessage}>{email}</Text>
            <Pressable
              style={[styles.closeButton, {backgroundColor: isPressed1 ? "#191970": "#6eacda"}]}
              onPressIn={() => setIsPressed1(true)}
              onPressOut={() => setIsPressed1(false)}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Login');
              }}>
              <Text style={styles.closeText}>Go to Login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  topbar: {
    flex: 1,
    marginTop: "10%",
    backgroundColor: "#7AB2D3"
  },
  signupContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#7AB2D3',
  },
  backButton: {
    marginLeft: 10 * scaleFactorWidth,
    marginTop: 12 * scaleFactorHeight,
    marginBottom: 5 * scaleFactorHeight
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.89,
    height: height * 0.121,
  },
  signupForm: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 30 * scaleFactorWidth,
    marginBottom: '5%',
    color: '#191970',
    fontWeight: "bold",
    letterSpacing:4
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14 * scaleFactorWidth,
    marginTop: 10 * scaleFactorHeight,
    marginBottom: 6 * scaleFactorHeight,
    marginLeft: 10 * scaleFactorWidth,
    color: '#888',
    fontWeight: "bold",
    letterSpacing:2
  },
  input: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10 * scaleFactorWidth,
    backgroundColor: '#f3f3f3',
    fontSize: 16,
    color: '#191970',
    borderWidth: 1, // Added for border highlighting
  },
  input2: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 10 * scaleFactorWidth,
    backgroundColor: '#f3f3f3',
    fontSize: 16,
    color: '#191970',
    borderWidth: 1, // Added for border highlighting
  },
  loginButton: {
    backgroundColor: '#191970',
    borderRadius: 30 * scaleFactorWidth,
    paddingVertical: 10 * scaleFactorHeight,
    paddingHorizontal: 35 * scaleFactorWidth,
    alignItems: 'center',
    marginTop: 30 * scaleFactorHeight,
    marginBottom: 20 * scaleFactorHeight,
    marginHorizontal: 20 * scaleFactorWidth,
    
  },
  loginText: {
    color: '#fff',
    fontSize: 20 * scaleFactorWidth,
    fontWeight: 'bold',
    letterSpacing:4,
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 3,
  },
  icon:{
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 3, height: 3 }, // Shadow offset
    textShadowRadius: 2, 
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between",
    marginHorizontal:"0%"
  },
  eyeIcon: {
    position: 'absolute',
    right: 15 * scaleFactorWidth,
    top: '20%',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color:"#191970",
    letterSpacing:1
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
    color:"#4682B4",
    fontWeight:"500",
  },
  modalMessage1: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color:"#191970",
  },
  closeButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight:"500",
    letterSpacing:1
  },
  
});

export default SignUpPage;
