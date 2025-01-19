import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, TouchableHighlight, BackHandler, Modal, Pressable } from 'react-native';
import { Ionicons , MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { getDoc, doc, getDocs, collection ,onSnapshot, query, where, orderBy} from 'firebase/firestore';
import { db } from '../firebaseconfig';

//import RouteList from './RouteScreen'
import BusfareList from './fare2';
import RouteList from './Route2';
import ScheduleList from './schedule';
import PurchaseList from './Purchase';
import PaymentScreen from '../test/test';
import AboutUs from './about';
import NotificationScreen from './NotificationList';


const PressableButton = ({ icon, label, onPress }) => {
  const [isActive, setIsActive] = useState(false);
  const handlePress = () => {
    setIsActive(!isActive); // Toggle the active state
    if (onPress) onPress(); // Execute custom action if provided
  };
  return (
    <Pressable onPress={handlePress} style={[styles.checkOutButton, {backgroundColor: isActive ? "#fff" :"#6eacda"},  {borderColor: isActive ? "#191970" :"#6eacda"}, ]}
      onPressIn={() => setIsActive(true)}
      onPressOut={() => setIsActive(false)} >
      <Ionicons
        name={isActive ? icon.active : icon.inactive}
        size={0.075*width}
        color={isActive ? "#191970" : "#fff"}
        style={[styles.icon, {textShadowColor : isActive ? "#fff" :"#191970"}]}
      />
      <Text style={[styles.checkOutText, {color: isActive ? "#191970" :"#fff"}, {textShadowColor : isActive ? "#fff" :"#191970"}]}>{label}</Text>
    </Pressable>
  );
};


// Get the screen dimensions
const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height) * 0.35;
const iconSize = width * 0.3;

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const { user, userData, setUserData } = useUser();
  const [trips, setTrips] = useState([]); // State to store trips
  const navigation = useNavigation(); // Hook for navigation
  const [selectedRoute, setSelectedRoute] = useState(''); 
  const [unseenCount, setUnseenCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isActive1, setIsActive1] = useState(false);
  const [isPressed2, setIsPressed2] = useState(false);
  const [isPressed3, setIsPressed3] = useState(false);

  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  

  useEffect(() => {
    const backAction = () => {
      setModalVisible(true); // Show modal on back press
      return true; // Prevent default back action
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  const handleExit = () => {
    setModalVisible(false);
    navigation.navigate('Login'); // Close the app if confirmed
  };
  const handleCancel = () => {
    setModalVisible(false); // Just close the modal
  };

  useEffect(() => {
    // Function to start listening to notifications in real-time
    const setupNotificationListener = () => {
      const userDocRef = doc(db, "MobileUser", user.uid);
      const notificationsRef = collection(userDocRef, "Notification");
      const notificationsQuery = query(notificationsRef, where("seen", "==", false));

      // Real-time listener to get the unseen notification count
      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        setNotificationCount(snapshot.docs.length);
      });

      return unsubscribe; // Return unsubscribe function to stop listening when component unmounts
    };

    // Start the listener when component mounts
    const unsubscribe = setupNotificationListener();
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [user.uid]);


  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "MobileUser", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No such document');
        }
      }
    };
    fetchUserData();
  }, [user]);

// fetch trip data
  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const userDocRef = doc(db, "MobileUser", user.uid);
      const tripsRef = collection(userDocRef, 'Purchase');

      const tripsQuery = query(
        tripsRef,
        where("departure_date", ">", today),
        orderBy("departure_date")
      );

      const unsubscribe = onSnapshot(tripsQuery, (tripSnapshot) => {
        try {
          // Directly map trip data from the Purchase collection
          const updatedTrips = tripSnapshot.docs.map(doc => {
            const trip = doc.data();
            return {
              ...trip,
              date: trip.departure_date || "N/A", // Fetch directly from the Purchase document
              time: trip.departure_time || "N/A", // Fetch directly from the Purchase document
              seat: trip.bus_seat || "N/A"        // Fetch directly from the Purchase document
            };
          });
          setTrips(updatedTrips);
        } catch (error) {
          console.error('Error updating scheduled trips:', error);
        }
      });
      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [user]);

  // Render the Home Content, including scheduled trips
  const renderHomeContent = () => (
    <View style={styles.homeContent}>
      {/* Header */}
      <View>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../assets/image/Title_TP_White.png")} />
        </View>
      </View>

      {/* Scheduled Trips Section */}
      <View style={styles.tripsSection}>
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={styles.sectionTitle}>Your Scheduled Trips</Text>
          <TouchableOpacity onPress={() => setActiveTab('Purchase')}>
            <Ionicons name="today" size={0.08*width} color="#191970" style={styles.tripStatus2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.tripList} showsVerticalScrollIndicator={false}>
          {trips.length > 0 ? (
            trips.map((trip, index) => (
              <View key={index} style={styles.tripCard}>
                <TouchableOpacity onPress={() => navigation.navigate('TicketInfo2', { itemId: trip.transactionID, tripId: trip.TripID })}>
                <View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                  <Text style={styles.tripText}>{trip.route || "Unknown Route"}</Text>
                  <Ionicons
                    name="ellipse"
                    size={20}
                    color={
                      trip.status === 'Active' ? '#06D001' :
                      trip.status === 'Delayed' ? 'orange' :
                      trip.status === 'Cancelled' ? 'red' :
                      trip.status === 'Used' ? 'gray' :
                      trip.status === 'Refunded' ? '#007BFF' :
                      '#D6D8DB' // default color for unknown status
                    }
                    style={styles.tripStatus} />
                  
                </View>
                  <Text style={styles.tripDetails}>
                    Date: {String(trip.departure_date || "N/A")}  |  
                    Time: {String(trip.departure_time || "N/A")}  |  
                    Seat: {String(trip.bus_seat || "N/A")}
                  </Text>
                </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noTripsText}>No Scheduled Trips</Text>
          )}
        </ScrollView>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsSection}>
        <Pressable style={[styles.button, { backgroundColor: isPressed1 ? '#fff' : '#191970' } ]}
          onPressIn={() => setIsPressed1(true)} onPressOut={() => setIsPressed1(false)} onPress={() => setActiveTab('Schedule')}>
          {isPressed1 ? (
            <Ionicons name="calendar-outline" size={0.15*width} color="#fff" style={{ color: '#191970' }}/>
          ):(
            <Ionicons name="calendar" size={0.15*width} color="#fff" style={{ color:  '#fff' }}/>
          )}
          <Text style={[styles.buttonText, { color: isPressed1 ? '#191970' : '#fff' }]}>BOOK A TRIP</Text>
        </Pressable>

        <Pressable style={[styles.button, { backgroundColor: isPressed ? '#fff' : '#191970' } ]}
          onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} onPress={() => navigation.navigate('book')}>
          {isPressed ? (
            <Ionicons name="bus-outline" size={0.15*width} color="#fff" style={{ color: isPressed ? '#191970' : '#fff' }}/>
          ):(
            <Ionicons name="bus" size={0.15*width} color="#fff" style={{ color: isPressed ? '#191970' : '#fff' }}/>
          )}
          <Text style={[styles.buttonText, { color: isPressed ? '#191970' : '#fff' }]}>BOOK A TRIP</Text>
        </Pressable>
        
      </View>
      {/* Check Out Section */}
      <View style={styles.checkOutSection}>
        <Text style={styles.sectionTitle}>Check out !!</Text>
        <View style={styles.checkOutButtons}>

          <PressableButton icon={{ active: "map", inactive: "map-outline" }}
            label="Route" onPress={() => setActiveTab("Routes")}/>
          <PressableButton icon={{ active: "cash", inactive: "cash-outline" }}
            label="Fare" onPress={() => setActiveTab("Fares")}/>

          <PressableButton icon={{ active: "people-circle-outline", inactive: "people-circle" }}
            label="About Us" onPress={() => navigation.navigate("About")}/>
        </View>
      </View>
    </View>
  );
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const userDocRef = doc(db, "MobileUser", user.uid);
      const tripsRef = collection(userDocRef, 'Purchase');

      const tripsQuery = query(
        tripsRef,
        where("departure_date", ">", today),
        orderBy("departure_date")
      );

      const unsubscribe = onSnapshot(tripsQuery, (tripSnapshot) => {
        const updatedTrips = tripSnapshot.docs.map(doc => doc.data());
        setTrips(updatedTrips);

        // Check for any trips within the next two days
        const currentDate = new Date();
        const reminderTrip = updatedTrips.find(trip => {
          const departureDate = new Date(trip.departure_date);
          const timeDifference = (departureDate - currentDate) / (1000 * 60 * 60 * 24);
          return timeDifference > 0 && timeDifference <= 8;
        });

        if (reminderTrip) {
          setUpcomingTrip(reminderTrip);
          setIsReminderModalVisible(true);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Reminder modal for upcoming trip
  const ReminderModal = () => (
    <Modal
      visible={isReminderModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsReminderModalVisible(false)}
    >
      <View style={styles.modalOverlayx}>
        <View style={styles.modalContainerx}>
          {upcomingTrip && (
            <>
              <Ionicons name="warning"  size={70} color="#f22" />
              <Text style={styles.modalTitlex}>YOUR TRIP IS COMMING !!!</Text>
              <Text style={styles.modalTextx}>Your booking for <Text style={styles.modalTextx1}>"{upcomingTrip.route}"
                </Text> is on <Text style={styles.modalTextx1}>"{upcomingTrip.departure_date}"</Text> at  
                <Text style={styles.modalTextx1}> "{upcomingTrip.departure_time}"</Text>.
              </Text>
              <Text style={styles.modalTextx}>Please arrive 15 minutes before departure. Safe travels!</Text>
              <TouchableOpacity
                style={[styles.closeButtonx]}
                onPress={() => setIsReminderModalVisible(false)}
              >
                <Text style={styles.closeButtonTextx}>Continue</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
       <ReminderModal />
      {/* Header */}
      <View style={styles.header}>

      <Pressable style={[ styles.TopIcons , { backgroundColor: isActive ? '#6eacda' : '#fff' }  ]} 
        onPressIn={() => setIsActive(true)} onPressOut={() => setIsActive(false)} onPress={() => navigation.navigate('prof')}>
          {isActive ? (
            <Ionicons name="person-circle-outline" size={0.15*width} color="#fff" style={{ color:  '#fff' }}/>
          ):(
            <Ionicons name="person-circle" size={0.15*width} color="#fff" style={{ color: '#191970' }}/>
          )}
        </Pressable>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          {userData ? (
            <Text style={styles.headerTitle}>
              Welcome, {userData.first_name || userData.email}!
            </Text>
          ) : (
            <Text style={styles.headerTitle} >Please log in.</Text>
          )}
        </View>

        <Pressable style={[styles.TopIcon2,  { backgroundColor: isActive1 ? '#6eacda' : '#fff' } ]} 
          onPressIn={() => setIsActive1(true)} onPressOut={() => setIsActive1(false)} onPress={() => navigation.navigate('Notif')}>
          <View>
          {isActive1 ? (
            <Ionicons name="notifications-circle-outline" size={0.15*width} color="#fff" style={{ color:  '#fff' }}/>
          ):(
            <Ionicons name="notifications-circle" size={0.15*width} color="#fff" style={{ color: '#191970' }}/>
          )}
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notificationCount}</Text>
            </View>
          )}
          </View>
        </Pressable>     
      </View>

      {/* Main Content */}
      <View style={styles.contentArea}>
        {activeTab === 'Home' && renderHomeContent()}
        {activeTab === 'Routes' && <RouteList setActiveTab={setActiveTab} setSelectedRoute={setSelectedRoute}/>}
        {activeTab === 'Fares' && <BusfareList activeTab={activeTab} setActiveTab={setActiveTab} />}
        {activeTab === 'Schedule' && <ScheduleList activeTab={activeTab} setActiveTab={setActiveTab} selectedRoute={selectedRoute}/>}
        {activeTab === 'Purchase' && <PurchaseList activeTab={activeTab} setActiveTab={setActiveTab}/>}
        {activeTab === 'pay' && <PaymentScreen activeTab={activeTab} setActiveTab={setActiveTab}/>}
        {activeTab === 'about' && <AboutUs activeTab={activeTab} setActiveTab={setActiveTab}/>}
        {activeTab === 'Notif' && <NotificationScreen activeTab={activeTab} setActiveTab={setActiveTab}/>}
         {/* RoutesScreen will render when "routes" is active */}
      </View> 

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => handleTabPress('Routes')} style={[styles.tabButton, activeTab === 'Routes' && styles.activeButton]}>
          <MaterialCommunityIcons style={styles.labelIcon} name="bus-marker" size={30} color={activeTab === 'Routes' ? '#fff' : '#191970'} />
          <Text style={[styles.iconLabel, activeTab === 'Routes' && styles.activeLabel]}>Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Purchase')} style={[styles.tabButton, activeTab === 'Purchase' && styles.activeButton]}>
          <Ionicons style={styles.labelIcon} name="ticket-outline" size={30} color={activeTab === 'Purchase' ? '#fff' : '#191970'} />
          <Text style={[styles.iconLabel, activeTab === 'Purchase' && styles.activeLabel]}>My Ticket</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Home')} style={[styles.tabButton, activeTab === 'Home' && styles.activeButton]}>
          <Ionicons style={styles.labelIcon} name="home" size={30} color={activeTab === 'Home' ? '#fff' : '#191970'} />
          <Text style={[styles.iconLabel, activeTab === 'Home' && styles.activeLabel]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Schedule')} style={[styles.tabButton, activeTab === 'Schedule' && styles.activeButton]}>
          <Ionicons style={styles.labelIcon} name="calendar-outline" size={30} color={activeTab === 'Schedule' ? '#fff' : '#191970'} />
          <Text style={[styles.iconLabel, activeTab === 'Schedule' && styles.activeLabel]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('book', { amount: "1000.00" })} style={[styles.tabButton, activeTab === 'BuyTicket' && styles.activeButton]}>
          <MaterialCommunityIcons style={styles.labelIcon} name="bus" size={30} color={activeTab === 'BuyTicket' ? '#fff' : '#191970'} />
          <Text style={[styles.iconLabel, activeTab === 'BuyTicket' && styles.activeLabel]}>Buy Ticket</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)} // Close modal on back press
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to exit?</Text>

            <View style={[styles.buttonContainer, ]}>
              <Pressable style={[styles.buttonEx1,  { backgroundColor: isPressed2 ? '#fff' : '#f22' }]} 
                 onPressIn={() => setIsPressed2(true)} onPressOut={() => setIsPressed2(false)} onPress={handleExit}>
                <Text style={[styles.buttonText1, { color: isPressed2 ? '#f22' : '#fff' } ]}>Yes, Exit</Text>
              </Pressable>
              
              <Pressable style={[styles.buttonEx, { backgroundColor: isPressed3 ? '#999' : '#6eacda' }, { borderColor: isPressed3 ? '#999' : '#6eacda' }]} 
                onPressIn={() => setIsPressed3(true)} onPressOut={() => setIsPressed3(false)} onPress={handleCancel}>
                <Text style={styles.buttonText1}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  TopIcons:{ margin: 4, marginLeft: "4%", backgroundColor:"pink", padding:2, borderRadius:10},
  TopIcon2:{ margin: 5,  marginRight: "4%", backgroundColor:"pink", padding:2, borderRadius:10  },

  container: { flex: 1, backgroundColor: '#B9E5E8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10%', backgroundColor: 'white' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#191970' },
  contentArea: { flex: 1, padding: 10, backgroundColor: '#6eacda' },
  homeContent: { flex: 1, backgroundColor: "#6eacda" },
  logo: { width: width * 0.90, height: height * 0.14, resizeMode: 'contain' },
  logoContainer: { alignItems: 'center' },
  
  tripsSection: { flex:1, backgroundColor: '#fff', borderRadius: 10, paddingTop:10, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color:"#191970", marginLeft:10 },
  tripList: { maxHeight: "100%", backgroundColor:"#ccc" , paddingHorizontal:10,marginBottom:10},
  tripCard: { flexDirection: 'column', justifyContent: 'space-between', padding: 10, backgroundColor: '#fff', marginVertical: 5, borderRadius: 5 },
  tripText: { fontWeight: 'bold', color:"#191970"},
  tripDetails: { fontSize: 12 , color:"#191970"},
  tripStatus2: { alignSelf: 'right' , marginRight:20},
  tripStatus: { alignSelf: 'right' },
  noTripsText: { textAlign: 'center', color: '#666', marginTop:"10%", fontSize:16, letterSpacing:1, fontWeight:"500" },

  buttonsSection: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 , width:"100%"},
  button: { backgroundColor: '#191970', paddingHorizontal: "7%", paddingVertical: "3.5%", borderRadius: 10, alignItems: 'center', borderWidth:3, borderColor:"#191970" },
  buttonText: { color: "#fff", marginTop: 5, fontWeight:"bold",  },


  checkOutSection: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 0, paddingVertical:"2.5%" },
  checkOutButtons: { flexDirection: 'row', justifyContent: 'space-around' , backgroundColor:"#e0e0e0", paddingVertical:"3%"},
  checkOutButton: { backgroundColor: '#4682B4', paddingHorizontal: "5%", paddingVertical: "2%", borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth:1, borderColor:"#6eacda"},
  checkOutText: { color: "#fff", marginLeft: 5, textShadowColor: '#191970', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1, },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 5, backgroundColor: 'white' },
  labelIcon: { alignSelf: 'center', paddingHorizontal:10 },
  
  iconLabel: { fontSize: 12, textAlign: 'center' , color:"#191970"},
  notificationBadge: {position: 'absolute', top: 0, right: 0, backgroundColor: 'red', borderRadius: 20, padding: 3, minWidth: 20, alignItems: 'center', justifyContent: 'center',},
  notificationCount: { color: 'white', fontWeight: 'bold', fontSize: 10 },

  tbottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f0f0f0', paddingVertical: 10,},
  tabButton: {alignItems: 'center', padding: 10, borderRadius: 10,},
  activeButton: { backgroundColor: '#191970', },
  iconLabel: { color: '#191970', fontSize: 12, },
  activeLabel: {color: '#fff', },

  modalOverlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color:"#191970" },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  buttonEx: { flex: 1, marginHorizontal: 5, paddingVertical: 5, backgroundColor: '#6eacda', borderRadius: 5, alignItems: 'center', borderWidth:2, borderColor: "#6eacda" },
  buttonEx1: { flex: 1, marginHorizontal: 5, paddingVertical: 5, backgroundColor: 'red', borderRadius: 5, alignItems: 'center', borderWidth:2, borderColor: "#f22" },
  buttonText1: { color: 'white', fontWeight: 'bold', fontSize:17 },
  icon:{ textShadowColor: '#191970', textShadowOffset: { width: 1, height: 2 },  textShadowRadius: 3, },

  modalOverlayx: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerx: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    paddingHorizontal: "2%",
    borderRadius: 10,
    alignItems: 'center',
    borderWidth:2,
    borderColor:"#f22",
  },
  modalTitlex: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#f22",
    marginTop:"5%"
    
  },
  modalTextx: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    marginTop:10,
    lineHeight: 29,
    letterSpacing:1,
    
  },
  modalTextx1: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    marginTop:10,
    color:"#191970",
    fontWeight:"bold",
  },
  closeButtonx: {
    backgroundColor: '#191970',
    paddingVertical: 10,
    paddingHorizontal:20,
    borderRadius: 5,
  },
  closeButtonTextx: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:17,
  },
});

export default DashboardScreen;
