import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Button, ActivityIndicator, Pressable, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, updateDoc } from '../firebaseconfig';
import { useUser } from '../UserContext';
import { collection, doc, query, orderBy, limit, where, onSnapshot, deleteDoc, startAfter, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [noTimestampLoaded, setNoTimestampLoaded] = useState(false);
  const { user } = useUser();
  const navigation = useNavigation();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

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
  const truncateText = (text, length) => text.length > length ? text.substring(0, length) + '...' : text;

   useEffect(() => {
    // Fetch notifications initially
    const fetchInitialNotifications = async () => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const notificationRef = collection(db, 'MobileUser', user.uid, 'Notification');
        const notificationsQuery = query(notificationRef, where('timestamp', '!=', null), orderBy('timestamp', 'desc'), limit(15));
        
        const snapshot = await getDocs(notificationsQuery);
        const fetchedNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setNotifications(fetchedNotifications);
        setIsInitialLoadComplete(true);  // Mark initial load complete

        if (!snapshot.empty) {
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching initial notifications: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isInitialLoadComplete) {
      fetchInitialNotifications();
    }
  }, [user?.uid, isInitialLoadComplete]);

  const loadMoreNotifications = async () => {
    if (loadingMore || !lastDoc) return;

    setLoadingMore(true);
    try {
      const notificationRef = collection(db, 'MobileUser', user.uid, 'Notification');
      const nextQuery = query(notificationRef, where('timestamp', '!=', null), orderBy('timestamp', 'desc'), startAfter(lastDoc), limit(15));
      const snapshot = await getDocs(nextQuery);
      
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(notification => 
        !notifications.some(existingNotification => existingNotification.id === notification.id)
      );

      setNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
      
      if (!snapshot.empty) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        fetchNoTimestampNotifications();
      }
    } catch (error) {
      console.error("Error loading more notifications: ", error);
    } finally {
      setLoadingMore(false);
    }
  };
  

  const fetchNoTimestampNotifications = async () => {
    try {
      const notificationRef = collection(db, 'MobileUser', user.uid, 'Notification');
      const noTimestampQuery = query(notificationRef, where('timestamp', '==', null), limit(15));
      const snapshot = await getDocs(noTimestampQuery);
      const fetchedNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setNotifications(prevNotifications => [...prevNotifications, ...fetchedNotifications]);
      setNoTimestampLoaded(true);
    } catch (error) {
      console.error("Error fetching notifications without timestamp: ", error);
    }
  };

  const confirmDelete = (notificationId) => {
    setSelectedNotification(notificationId);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const notificationDoc = doc(db, 'MobileUser', user.uid, 'Notification', selectedNotification);
      await deleteDoc(notificationDoc);
      setNotifications(notifications.filter(notification => notification.id !== selectedNotification));
      
      Toast.show({
        type: 'error',
        text1: 'Notification is Deleted!',
        text2: "ID: " + selectedNotification,
        visibilityTime: 3000,
      });
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.seen) {
      const notificationDoc = doc(db, 'MobileUser', user.uid, 'Notification', notification.id);
      await updateDoc(notificationDoc, { seen: true });
    }
    navigation.navigate('NotifView', { notification });
  };

  const renderNotification = ({ item }) => {
    const isUnread = !item.seen;
    
    return (
      <TouchableOpacity 
        style={[styles.notificationBox, isUnread && styles.unreadNotificationBox]} 
        onPress={() => handleNotificationPress(item)}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text style={[styles.title, isUnread && styles.unreadText]}>{item.title}</Text>
          
          <TouchableOpacity style={[styles.deleteIcon, isUnread && styles.iconcolor]} onPress={() => confirmDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.category1, isUnread && styles.unreadText]}>{formatTimestamp(item.timestamp)}</Text>
        <Text style={[styles.category, isUnread && styles.unreadText]}>CAT: {item.category}</Text>
        <Text style={[styles.body, isUnread && styles.unreadBody]}>{truncateText(item.body, 38)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
        <TouchableOpacity onPress={() => navigation.navigate('dash')}>
          <Ionicons name="arrow-back-outline" size={35} color="#191970" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore && <ActivityIndicator size="small" color="#0000ff" />}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color:"#fff", fontSize:20, fontWeight:"500",letterSpacing:2 }}>No notifications available.</Text>}
        />
      )}

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
  icon:{
    textShadowColor: '#6eacda',        // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 1, 
  },
  container: {
    flex: 1,
    backgroundColor: '#6eacda',
    marginTop: "10%",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  headerTitle: {
    color: '#191970',
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 20
  },
  notificationBox: {
    backgroundColor: '#F4F4F8',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    position: 'relative',
    elevation: 2,
  },
  title: {
    width:"90%",
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:"#6eacda"
  },
  category: {
    fontSize: 14,
    color: '#6eacda',
    marginBottom: 5,
    fontWeight:"500",
    marginLeft:"0%"
  },
  category1: {
    fontSize: 12,
    color: '#6eacda',
    fontWeight:"500"
  },
  body: {
    fontSize: 14,
    color: '#666',
  },
  deleteIcon: {
    width:"10%",
    height:"30",
    backgroundColor:"#4682B4",
    paddingHorizontal:5,
    paddingVertical:5,
    borderRadius:5,
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
    backgroundColor:"#f22",
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
  unreadNotificationBox: {
    borderWidth: 2,
    borderColor: '#191970',
  },
  unreadText: {
    color: '#191970',
  },
  unreadBody: {
    color: '#191970',  // Darker red for the body text, optional
  },
  iconcolor: {
    backgroundColor: '#191970',  // Darker red for the body text, optional
  },
});

export default NotificationScreen;
