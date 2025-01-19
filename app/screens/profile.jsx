import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Dimensions, Alert, Pressable, BackHandler} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext'; // Import the custom hook to access user data
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseconfig'; // Import your Firebase auth instance
import { Ionicons } from '@expo/vector-icons';
import Toast, {BaseToast , ErrorToast } from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height) * 0.35;
const baseWidth = 375;
const scaleFactor = width / baseWidth;
const baseHeight = 667;
const scaleFactorWidth = width / baseWidth;
const scaleFactorHeight = height / baseHeight;
const iconSize = width * 0.3;




const toastConfig1= {
    success: (props) => (
      <BaseToast
      {...props}
      style={{
        borderLeftColor: '#2c7721',
        borderLeftWidth: 10,
        marginTop: 0,
        height: "80%",
        backgroundColor: "#76bf4c",
        flexDirection: 'row',
        alignItems: 'center',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderLeadingIcon={() => (
        <AntDesign name="checkcircleo" size={30} color="#fff" style={{ marginLeft: "3%" }} />
      )}
      text1Style={{
        fontSize: 20,
        color: 'white'
      }}
      text2Style={{
        fontSize: 12,
        color: 'white',
        flexWrap: 'wrap',  // Allow text to wrap
        width: '90%',      // Ensure enough width for wrapping
      }}
      />
    ),
    
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          position: 'absolute',
          top: 0,
          zIndex: 9999,
          left: 0,
          right: 0,
          borderLeftColor: '#c81912ed',
          borderLeftWidth: 10,
          backgroundColor: "#f63e50",
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        renderLeadingIcon={() => (
          <Ionicons name="close-circle-outline" size={40} color="#fff" style={{ marginLeft: "3%" }} />
        )}
        text1Style={{
          fontSize: 17,
          color: 'white'
        }}
        text2Style={{
          fontSize: 12,
          color: 'white',
          flexWrap: 'wrap',  // Allow text to wrap
          width: '90%',      // Ensure enough width for wrapping
        }}
  
      />
    ),
    warning: (props) => (
      <BaseToast
        {...props}
        style={{
          position: 'absolute',
          top: 0,
          zIndex: 9999,
          left: 0,
          right: 0,
          borderLeftColor: '#b15500',
          borderLeftWidth: 10,
          backgroundColor: "#f88f01",
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        renderLeadingIcon={() => (
          <Feather name="alert-triangle" size={30} color="#fff" style={{ marginLeft: "3%" }} />
        )}
        text1Style={{
          fontSize: 20,
          color: 'white'
        }}
        text2Style={{
          fontSize: 12,
          color: 'white',
          flexWrap: 'wrap',  // Allow text to wrap
          width: '90%',      // Ensure enough width for wrapping
        }}
      />
    ),
  };


  

export default function ProfilePage() {
    const navigation = useNavigation();
    const { userData, loading, updateUserData,  setUserData } = useUser(); // Access updateUserData to update user info in database
    const [modalVisible, setModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false); // State for password modal
    const [logoutModalVisible, setLogoutModalVisible] = useState(false); // State for logout confirmation modal
    const [editData, setEditData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        birthday: ''
    });

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [isPressed, setIsPressed] = useState(false);
    const [isPressed1, setIsPressed1] = useState(false);

    const [isPressed2, setIsPressed2] = useState(false);
    const [isPressed3, setIsPressed3] = useState(false);

    const [isPressed4, setIsPressed4] = useState(false);
    const [isPressed5, setIsPressed5] = useState(false);
    const [isPressed6, setIsPressed6] = useState(false);

    useEffect(() => {
      const backAction = () => {
        navigation.goBack(); // Go back to the previous screen
        return true; // Prevent default back action
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
    }, [navigation]);
  

    useEffect(() => {
        if (userData) {
            setEditData({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                phone: userData.phone || '',
                birthday: userData.birthday || ''
            });
        }
    }, [userData]);

    const handleSave = async () => {
        try {
            await updateUserData(editData);
            setModalVisible(false); // Close the modal after saving
            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                visibilityTime: 1000,
            });
        } catch (error) {
            console.error("Error updating profile: ", error);
            Toast.show({
              type: 'error',
              text1: 'Error !',
              text2: error.code,
              visibilityTime: 1000,
          });
        }
    };



    const handlePasswordChange = async () => {
        const user = auth.currentUser;

        if (!oldPassword || !newPassword) {
            Toast.show({
                type: 'warning',
                text1: 'Empty fields!',
                text2: "Please fill both fields.",
                visibilityTime: 3000,
              });
            return;
        }

        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        
        try {
            // Reauthenticate user
            await reauthenticateWithCredential(user, credential);
            // Update the password
            await updatePassword(user, newPassword);
          
            setPasswordModalVisible(false); // Close modal after success
            Toast.show({
              type: 'success',
              text1: 'Password Updated !',
              visibilityTime: 2000,
            });
        } catch (error) {
            console.error("Error updating password: ", error);
            const errorCode = error.code;
            console.log(error.code)

            if (errorCode === "auth/missing-password") {
              Toast.show({
                type: 'warning',
                text1: 'Missing Password',
                text2: 'Please provide a password to continue.',
                visibilityTime: 2000,
              });
            } else if (errorCode === "auth/invalid-credential") {
              Toast.show({
                type: 'error',
                text1: 'Password Update Fail !',
                text2: 'Please enter old password correctly!',
                visibilityTime: 3000,
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Unexpected error :',
                text2: error.code,
                visibilityTime: 3000,
              });
            }
    }
  };


    const handleLogout = () => {
        // Clear user data and navigate to SignIn screen
        setUserData(null); // Reset user data in UserContext.js
        
        navigation.navigate('SignIn'); // Navigate back to SignIn page
    };

    if (!userData) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }


    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

                <View style={styles.header1}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('dash')}>
                        <AntDesign name="arrowleft" size={40} color="#fff" style={styles.icon}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutModalVisible(true)}>
                        <Ionicons name="log-out-outline" size={40} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                </View>

            {/* Header */}
            <View style={styles.header}>

                <Text style={styles.label1}>ID: {String(userData.user_id || '')}</Text>
                <View style={[styles.profileIconContainer, { width: iconSize, height: iconSize }]}>
                    <AntDesign name="user" size={iconSize * 0.6} color="#4682B4" />
                </View>
                {userData && <Text style={styles.profileName}>{String(userData.first_name || '')} {String(userData.last_name || '')}</Text>}
                
            </View>

            {/* Profile Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.input} editable={false} value={String(userData?.email || '')} />
                <Text style={styles.label}>Phone:</Text>
                <TextInput style={styles.input} editable={false} value={String(userData?.phone || '')} />
                <Text style={styles.label}>Birth Date:</Text>
                <TextInput style={styles.input} editable={false} value={String(userData?.birthday || '')} />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button, {backgroundColor: isPressed ? "#191970" : "#fff"}]} 
                  onPressIn={() => setIsPressed(true)}
                  onPressOut={() => setIsPressed(false)}
                  onPress={() => setModalVisible(true)}>
                    <Text style={[styles.buttonText , {color: isPressed ? "#fff" : "#191970"}]}>Edit Profile</Text>
                </Pressable>

                <Pressable style={[styles.button2, {backgroundColor: isPressed1 ? "#fff" : "#191970"}]} 
                  onPressIn={() => setIsPressed1(true)}
                  onPressOut={() => setIsPressed1(false)}
                  onPress={() => setPasswordModalVisible(true)}>
                    <Text style={[styles.buttonText2 , {color: isPressed1 ? "#6eacda" : "#fff"}]}>Change Password</Text>
                </Pressable>
            </View>










            {/* Edit Profile Modal */}
            <Modal visible={modalVisible} transparent={true} animationType="slide" >
                <View style={styles.modalContainer}>
                    <Toast config={toastConfig1}/>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="First Name"
                            value={editData.first_name}
                            onChangeText={(text) => setEditData({ ...editData, first_name: text })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Last Name"
                            value={editData.last_name}
                            onChangeText={(text) => setEditData({ ...editData, last_name: text })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Phone"
                            value={editData.phone}
                            onChangeText={(text) => setEditData({ ...editData, phone: text })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Birthday"
                            value={editData.birthday}
                            onChangeText={(text) => setEditData({ ...editData, birthday: text })}
                            editable={false} 
                        />

                        {/* Modal Buttons */}
                        <View style={styles.modalButtonContainer}>
                            <Pressable style={[styles.modalButtonSave, {backgroundColor: isPressed2 ? "#191970" : "#6eacda"}]} 
                            onPressIn={() => setIsPressed2(true)}
                            onPressOut={() => setIsPressed2(false)}
                            onPress={handleSave}>
                                <Text style={styles.modalButtonText}>Save</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButtonCancel,  {backgroundColor: isPressed3 ? "#fff" : "#999"},  {borderColor: isPressed3 ? "#191970" : "#999"}]} 
                              onPressIn={() => setIsPressed3(true)}
                              onPressOut={() => setIsPressed3(false)}
                              onPress={() => [setModalVisible(false), setIsPressed3(false)]}>
                                <Text style={[styles.modalButtonText, {color: isPressed3 ? "#191970" : "#fff"}]}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>










            {/* Change Password Modal */}
            <Modal visible={passwordModalVisible} transparent={true} animationType="slide" >
                
                <View style={styles.modalContainer} >
                    <Toast config={toastConfig1}/>
                    <View style={styles.modalContent}>

                        <Text style={styles.modalTitle}>Change Password</Text>

                        {/* Old Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.modalInput}
              placeholder="Old Password"
              secureTextEntry={!showOldPassword} // Toggle visibility
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
              <Ionicons 
                name={showOldPassword ? "eye-off" : "eye"} 
                size={24} 
                color="grey" 
                style={styles.eyeIcon} 
              />
            </TouchableOpacity>
          </View>

          {/* New Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              secureTextEntry={!showNewPassword} // Toggle visibility
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Ionicons 
                name={showNewPassword ? "eye-off" : "eye"} 
                size={24} 
                color="grey" 
                style={styles.eyeIcon} 
              />
            </TouchableOpacity>
          </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalButtonContainer}>
                            <Pressable style={[styles.modalButtonSave,  {backgroundColor: isPressed4 ? "#191970" : "#6eacda"}]} 
                              onPressIn={() => setIsPressed4(true)}
                              onPressOut={() => setIsPressed4(false)}
                              onPress={handlePasswordChange}>
                                <Text style={styles.modalButtonText}>Save</Text>
                            </Pressable>

                            <Pressable style={[styles.modalButtonCancel,  {backgroundColor: isPressed5 ? "#fff" : "#999"},  {borderColor: isPressed5 ? "#191970" : "#999"}]} 
                              onPressIn={() => setIsPressed5(true)}
                              onPressOut={() => setIsPressed5(false)}
                              onPress={() => setPasswordModalVisible(false)}>
                                <Text style={[styles.modalButtonText, {color: isPressed5 ? "#191970" : "#fff"}]}>Cancel</Text>
                              </Pressable>  
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal visible={logoutModalVisible} transparent={true} animationType="slide" >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.text}> Are you sure you want to logout?</Text>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButtonSave1} onPress={handleLogout}>
                                <Text style={styles.modalButtonText}>Logout</Text>
                            </TouchableOpacity>

                            <Pressable style={[styles.modalButtonCancel,  {backgroundColor: isPressed6 ? "#fff" : "#999"},  {borderColor: isPressed6 ? "#191970" : "#999"}]} 
                              onPressIn={() => setIsPressed6(true)}
                              onPressOut={() => setIsPressed6(false)}
                              onPress={() => setLogoutModalVisible(false)}>
                                <Text style={[styles.modalButtonText, {color: isPressed6 ? "#191970" : "#fff"}]}>Cancel</Text>
                            </Pressable>         
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6eacda', //'#4682B4',
    padding: 20,
    paddingTop: '15%'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    
  },
  header1: {
    alignSelf:"center",
    alignItems: 'center',
    flexDirection:"row",
    justifyContent:"space-between",
    width:"97%",
    
  },
  backButton: {
    //alignSelf: 'flex-start',
    marginLeft: "1%",
    marginBottom:"7%"
  },

  profileIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Example background color
    borderRadius: 9999, // Ensures the container is a perfect circle
    overflow: 'hidden', // Hide any overflow content
    aspectRatio: 1,
    marginHorizontal: 10 * scaleFactorWidth,
    marginBottom: 15*scaleFactorHeight,
  },
  userIcon:{
    alignSelf: 'center',
    justifyContent:"center",
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileName: {
    fontSize: 30* scaleFactor,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5 * scaleFactorHeight,
    letterSpacing:2,
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 2, 
    paddingHorizontal:5
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  
  },
  label: {
    fontSize: 16 *scaleFactorWidth,
    fontWeight: 'bold',
    color: '#999',
    marginLeft: 7 *scaleFactorWidth
  },
  label1:{
    fontSize: 16 *scaleFactorWidth,
    color: '#fff',
    marginLeft: 7 *scaleFactorWidth,
    paddingBottom: 20,
  },
  input: {
    fontSize: 15 *scaleFactorWidth,
    marginBottom: 4* scaleFactorHeight,
    backgroundColor: '#f5f5f5',
    marginLeft: 0,
    paddingHorizontal: 10 * scaleFactorWidth,
    borderRadius: 5 * scaleFactorWidth,
    marginVertical: 10 * scaleFactorHeight,
    paddingVertical: 5 * scaleFactorHeight,
    color: '#191970',
    fontWeight:"500",
    fontSize:18 * scaleFactorWidth,
    letterSpacing:2
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:"100%"
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10 * scaleFactorHeight,
    paddingHorizontal: 15 * scaleFactorWidth,
    borderRadius: 15 * scaleFactorWidth,
    marginVertical: 15 * scaleFactorHeight
  },
  buttonText: {
    fontSize: 20 * scaleFactorWidth,
    fontWeight: 'bold',
    color: '#191970',
  },
  button2: {
    backgroundColor: '#191970',
    paddingVertical: 10 * scaleFactorHeight,
    paddingHorizontal: 15 * scaleFactorWidth,
    borderRadius: 15 * scaleFactorWidth,
    marginVertical: 15 * scaleFactorHeight
  },
  buttonText2: {
    fontSize: 20 * scaleFactorWidth,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1, 
    elevation: 1
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 20,
    color:"#03346e",
    letterSpacing:2
  },
  modalInput: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    color:"#191970",
    fontSize:18,
    letterSpacing:1
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop:"5%"
  },
  
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#999',
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth:2,
    borderColor:"#999"
  },
  modalButtonSave: {
    flex: 1,
    backgroundColor: '#6eacda',
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonSave1: {
    flex: 1,
    backgroundColor: '#f22f0f',
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:20
  },
  logoutButton: {
    //alignSelf: 'flex-end',
    marginRight: "1%", // Positioning the logout button in the top right corner
    marginBottom:"7%"
  },
  text:{
    fontSize: 15,
    marginBottom: 25,
    color:"#191970",
    alignSelf: 'center',

  },
  icon:{
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 3, height: 3 }, // Shadow offset
    textShadowRadius: 2, 
    
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15 * scaleFactorWidth,
    top: '-30%',
  },

});
