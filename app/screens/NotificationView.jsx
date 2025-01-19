import {React , useState, useEffect}from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView , Modal, Pressable, BackHandler} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, updateDoc } from '../firebaseconfig';
import { collection, doc, deleteDoc, } from "firebase/firestore";
import { useUser } from '../UserContext';
import Toast from 'react-native-toast-message';

const NotificationDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { notification } = route.params; // Notification data passed from NotificationScreen
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useUser();
  const [isPressed, setIsPressed] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);

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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "No date available";
    const date = timestamp.toDate();
    return date.toLocaleString(); // Convert to readable date-time format
  };


  const handleDelete = async () => {
    try {
      const notificationDoc = doc(db, 'MobileUser', user.uid, 'Notification', notification.id);
      await deleteDoc(notificationDoc);
      
      Toast.show({
        type: 'error',
        text1: 'Notification is Deleted!',
        text2: "ID: " + notification.id,
        visibilityTime: 3000,
      });
      // Delay navigation until the toast is done displaying
      setTimeout(() => {
        navigation.goBack(); // Navigate back to the previous screen
        // Or use navigation.navigate('MainScreen') if you want to navigate to a specific screen
      },   3000);
      setModalVisible(false);

    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.header}>
          <View style={{width:"70%"}}>
          <Text style={styles.category3}>{formatTimestamp(notification.timestamp)}</Text>
          <Text style={styles.notificationId}>NOTIFICATION ID :</Text>
          <Text style={styles.category2}>{notification.id}</Text>
          
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.deleteButon}>
            <Ionicons name="trash-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
        
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={styles.title}>Title: </Text>
          <Text style={styles.title1}>{notification.title}</Text>
          </View>
          <Text style={styles.category}>Category: <Text style={styles.category1} >{notification.category}</Text></Text>
          
        </View>



        <ScrollView style={styles.scrollContainer}>

          <View style={styles.footer}>
            <View>
              <Text style={styles.body}>{notification.body}</Text>
            </View>
          
            <View style={styles.bottomsec}>
              <Text style={styles.footerText}>
                Is this notification irrelevant?? tell us at the provided contacts below.
              </Text>
              <Text style={styles.footerText1}>Have a nice day!!</Text>
              <Text style={styles.footerText}>- Management</Text>

              <Text style={styles.helpDesk}>Help Desk:</Text>
              <Text style={styles.contact}>Email: Help@gmail.com</Text>
              <Text style={styles.contact}>Phone: 09988669677</Text>
            </View>
          </View>
          
        </ScrollView>
        <View>
        <TouchableOpacity style={styles.returnButton} onPress={() => navigation.navigate("Notif")}>
          <Text style={styles.returnButtonText}>Return</Text>
        </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
          <Text style={styles.modalTitle}>DELETE NOTIFICATION</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this notification?</Text>
            <View style={styles.modalButtons}>

            <Pressable style={[styles.modalButton1, {backgroundColor: isPressed ? "#fff" : "#f22"}]} 
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={handleDelete} >
                <Text style={[styles.modalText1, {color: isPressed ? "#f22" : "#fff"}]}> YES </Text>
              </Pressable>

              <Pressable style={[styles.modalButton2, {backgroundColor: isPressed1 ? "#191970" : "#999"} ]} 
                onPressIn={() => setIsPressed1(true)}
                onPressOut={() => setIsPressed1(false)}
                onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalText2, ]}> CANCEL </Text>
              </Pressable >

              
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6eacda',
    paddingTop: '10%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth:2,
    borderColor:"#4682B4"
  },
  notificationId: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#4682B4',
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 16,
    paddingBottom: 16,
    flex: 1,
  },
  scrollContainer: {
    marginHorizontal: "3%",
    backgroundColor:"#f0f0f0",
    borderRadius:10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#aaa',
  },
  title1: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: 8,
    color: '#03346e',
    width:"85%",
    letterSpacing:0.5
  },
  category: {
    fontSize: 16,
    color: '#aaa',
    marginVertical: 8,
    fontWeight:"700"
  },
  category1: {
    fontSize: 16,
    color: '#03346e',
    marginVertical: 8,
    fontWeight:"400",
    letterSpacing:1
  },
  category2: {
    fontSize: 16,
    color: '#03346e',
    fontWeight:"400"
  },
  category3: {
    fontSize: 12,
    color: '#03346e',
    fontWeight:"400"
  },
  body: {
    fontSize: 16,
    color: '#333',
    marginVertical: 8,
  },
  footer: {
    paddingHorizontal: "5%",
    paddingVertical:"1%"
  },
  footerText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginHorizontal:5
  },
  footerText1: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginHorizontal:5,
    marginTop:10,
    fontWeight:"bold",

  },
  helpDesk: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#191970',
    marginHorizontal:5,
    marginBottom:5
  },
  contact: {
    fontSize: 14,
    color: '#666',
    marginHorizontal:5,
    paddingHorizontal:20,
    marginTop:5
  },
  returnButton: {
    backgroundColor: '#03346e',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
  },
  returnButtonText: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing:2
  },
  deleteButon:{
    backgroundColor:"#4682B4",
    padding:5,
    borderRadius:10,
    marginRight:5,
    
  },
  details:{
    marginHorizontal:"5%",
  },
  bottomsec:{
    marginTop:"15%",
    borderTopWidth:2,
    paddingTop:10,
    borderColor:"#4682B4"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    marginHorizontal:10,
    fontWeight:"400"
  },
  modalText1: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal:10,
    fontWeight:"400",
    color:"#fff", 
    fontWeight:"bold",
  },
  modalText2: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal:10,
    fontWeight:"400",
    color:"#fff", 
    fontWeight:"bold",
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight:"bold",
    color:"#f22"
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width:"40%",
    backgroundColor:"red",
    paddingVertical:"3%",
    borderRadius:15,
    borderWidth:2,
    borderColor:"#f22"

  },
  modalButton2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%',
    backgroundColor:"#999",
    paddingVertical:"3%",
    borderRadius:15,
  },
});

export default NotificationDetailsScreen;
