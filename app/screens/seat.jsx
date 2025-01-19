import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, BackHandler} from 'react-native';
import { db } from '../firebaseconfig';
import { doc, getDoc, setDoc, updateDoc, Timestamp, increment, addDoc, collection  } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import PayPalWebView from '../test/samp'; // Import your PayPalWebView component here
import Toast from 'react-native-toast-message';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useUser } from '../UserContext';
import { useFocusEffect } from '@react-navigation/native';



const TicketDetailsScreen = ({ route, navigation }) => {
  const { userData } = useUser();
  const { scheduleID } = route.params;
  const [scheduleDetails, setScheduleDetails] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('NA');
  const [discountedFare, setDiscountedFare] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [transactionDetails, setTransactionDetails] = useState({});
  const [isPressed, setIsPressed] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);
  const [ticketData, setTicketData] = useState({});

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

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.selectedSeat) {
        setSelectedSeat(route.params.selectedSeat);
        navigation.setParams({ selectedSeat: null }); // Reset `selectedSeat` after setting it
      }
    }, [route.params?.selectedSeat])
  );

  const fetchScheduleDetails = async () => {
    try {
      const docRef = doc(db, 'BusSchedule', scheduleID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setScheduleDetails(docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching schedule details:', error);
    }
  };

  useEffect(() => {
    fetchScheduleDetails();
  }, []);

  useEffect(() => {
    if (scheduleDetails && scheduleDetails.fare) {
      const discountedValue = scheduleDetails.fare - scheduleDetails.fare * 0.10;
      setDiscountedFare(discountedValue);
    }
  }, [scheduleDetails]);

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
  };

  const checkSeatStatus = async () => {
    try {
      const docRef = doc(db, 'BusSchedule', scheduleID); // Replace with your collection and document ID
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const seatsMap = docSnap.data().seats; // Adjust 'seats' to your map field name
        const seatID = selectedSeat; // Replace with the seat you’re looking for
  
        // Check if the seat ID exists in the map
        if (seatsMap.hasOwnProperty(seatID)) {
          const seatStatus = seatsMap[seatID];
  
          // Compare the seat status
          if (seatStatus === "Reserved") {
            Toast.show({
              type: 'error',
              text1: `Seat ${seatID} is Reserved`,
              text2: 'Please select a diffrent seat.',
            });
          } else {
            console.log(`Seat ${seatID} is ${seatStatus}`);
          }
        } else if (seatID !== "NA"){
          Toast.show({
            type: 'error',
            text1: `Seat ${seatID} not found in the map`,
            text2: 'Invalid data error',
          });
        }else{
          // put a question here

        }
      } else {
        Toast.show({
          type: 'error',
          text1: `Schedule ${scheduleID} not found `,
          text2: 'Schedule does not exists',
        });
        console.log("No such document!");
      }
    } catch (error) {
      Toast.show({
          type: 'error',
          text1: `Fatal error found `,
          text2: `Error : ${error}`,
      });
    }
  };
  
  // Call the function in useEffect
  useEffect(() => {
    if (selectedSeat !== 'NA') {
      checkSeatStatus();
      console.log("Selected Seat:", selectedSeat);
    console.log("Schedule ID:", scheduleID);
    }
    checkSeatStatus();
  }, [selectedSeat]);

  const handlePaymentSuccess = async (payerId) => {
    const tripID = uuid.v4();
    const transactionID = uuid.v4();
    const saleID = uuid.v4();
    const account_id = userData ? userData.user_id : null; // Get account_id from userData
    const customDocID = uuid.v4();
    const sched = scheduleID

    // Construct your data for upload

    // this is a subtest document sending of a perfect
    const TripInfo = {
        TripID: tripID,
        ScheduleID: scheduleID,
        departure_date: scheduleDetails.departure_date,
        departure_time: scheduleDetails.departure_time,
        transaction_date: Timestamp.fromDate(new Date()),
        route: scheduleDetails.route,
        class: scheduleDetails.bus_class,
        bus_id: scheduleDetails.bus_id,
        bus_seat: selectedSeat,
        status: "Active",
        account_id: account_id, // Use validated account_id
    };

    const transactionData = {
        transactionID: transactionID,
        TripID: tripID,
        ScheduleID: scheduleID,
        discount: 'APP',
        price: discountedFare.toFixed(2),
        mode: 'Online',
        transaction_date: Timestamp.fromDate(new Date()),
        route: scheduleDetails.route,
        status: "Active",
        account_id: account_id, // Use validated account_id
    };

    const transactionCopy = {
      //ID related 
      transactionID: transactionID,
      TripID: tripID, // irrelevant
      account_id: account_id, // irreleveant

      // trip related
      ScheduleID: scheduleID,
      route: scheduleDetails.route,
      bus_id : scheduleDetails.bus_id,
      departure_date: scheduleDetails.departure_date,
      departure_time: scheduleDetails.departure_time,
      bus_seat: selectedSeat,

      //transaction related
      transaction_date: Timestamp.fromDate(new Date()),
      discount: 'APP',
      price: discountedFare.toFixed(2),
      Mode: 'Online',
      status: "Active",     
    };

    const saleData = {
        ID: saleID,
        transactionID: transactionID,
        TripID: tripID,
        ScheduleID: scheduleID,
        price: discountedFare.toFixed(2),
        transaction_date: Timestamp.fromDate(new Date()),
        account_id: account_id, // Use validated account_id
        terminal: 'Mobile App',
        status: 'Payed',
    };
    const Notif = {
      title: `You have Booked A Trip!! ${scheduleDetails.route}`,
      category: 'General Notification',
      body: 
`Your bus booking is confirmed! Here are your trip details: \n

  Route:                     ${scheduleDetails.route} 
  Departure Date:     ${scheduleDetails.departure_date} 
  Departure Time:    ${scheduleDetails.departure_time} 
  Bus ID:                    ${scheduleDetails.bus_id} 
  Seat Number:        ${selectedSeat} 
  Class:                     ${scheduleDetails.bus_class} 
  Price Paid:             ${discountedFare.toFixed(2)} \n

TRN:   ${transactionID} 
TRP:   ${tripID} 
UID:   ${account_id} \n\n

      Please arrive 15 minutes before departure. Safe travels!
    `,
      timestamp: Timestamp.fromDate(new Date()),
      seen: false,
     
  };

    // Upload ticket data to Firestore
    try {
      await setDoc(doc(db, 'tripInfo', tripID), TripInfo);
      await setDoc(doc(db, 'transactions', transactionID), transactionData);
      await setDoc(doc(db, 'sales', saleID), saleData);

      const today = new Date().toISOString().split('T')[0];
      const dailyRef = doc(db, 'DailyTransactions', today);
      const dailySalesRef = doc(db, 'DailySales', today);
      const notificationCollectionRef = collection(db, 'MobileUser', account_id, 'Notification');

      await setDoc(dailyRef, {
          date: today,
          transaction_count: increment(1) // Correct way to use increment
      }, { merge: true });

      await setDoc(dailySalesRef, {
          date: today,
          sales_count: increment(parseFloat(discountedFare.toFixed(2))) // Correct way to use increment
      }, { merge: true });


      const schedref = doc(db, 'BusSchedule', sched);
      await updateDoc(schedref, {
        [`seats.${selectedSeat}`]:  account_id// Update the value of the specified seat to "Active"
      });
      if (account_id) {
          await setDoc(doc(db, 'MobileUser', account_id, 'Purchase', transactionID), transactionCopy);
          await addDoc(notificationCollectionRef, Notif);
      } else {
          console.error("Account ID is undefined");
      }

      console.log(transactionID);
      //console.log('Ticket successfully created with ID: ', docRef.id); // testing document sendting data
      console.log('Ticket successfully created with ID: ', transactionID);

      Toast.show({
        type: 'success',
        text1: 'Ticket successfully created ', 
        text2: `ID : ${transactionID}`,
      });
      // Navigate to the TicketDisplay screen and pass the ticketData
      navigation.navigate('TicketInfo2', { itemId: transactionID, tripId:  tripID })

    } catch (error) {
      console.error('Error adding ticket: ', error);
    }

   // Print the ticket data to the console
    //console.log('Ticket Data:', ticketData);
  };

  const handlePay = () => {

    setTransactionDetails({
      scheduleId: scheduleID, // Example, replace with actual data
      route: scheduleDetails.route, // Add other necessary fields
      seatNumber: selectedSeat,
      scheduleDay: scheduleDetails.departure_date,    // Add schedule day
      scheduleTime: scheduleDetails.departure_time
    });
    if (selectedSeat === 'NA') {
      Toast.show({
        type: 'warning',
        text1: 'No Seat Selected',
        text2: 'Please select a seat before paying.',
      });
      return;
    }
    setModalVisible(true); // Show the modal with payment gateway
  };
  if (!scheduleDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.container1}>Loading schedule details...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>

      {/* Back button */}
      <View style={styles.Top}>
        <AntDesign name="arrowleft" size={35} color="white" style={styles.backIcon} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>BUY TICKET</Text>
      </View>
      <View style={styles.ticketCard}>
        {/* Display schedule details */}
        <Text style={styles.routeText}>Route:</Text>
        <Text style={styles.routeDetails}>{scheduleDetails.route}</Text>
        <Text style={styles.routeText}>Departure:</Text>
        <View style={{marginLeft:"20%"}}>
          <View style={{flexDirection:"row", justifyContent:"Flex-start"}}>
            <Text style={styles.detailsText}>Date:    </Text>
            <Text style={styles.detailsText1}>{scheduleDetails.departure_date}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"Flex-start"}}>
            <Text style={styles.detailsText}>Time:   </Text>
            <Text style={styles.detailsText1}>{scheduleDetails.departure_time}</Text>
          </View>
        </View>
        <Text style={styles.routeText}>Bus Information:</Text>
        <View style={{marginLeft:"20%"}}>
          <View style={{flexDirection:"row", justifyContent:"space-Flex-start"}}>
            <Text style={styles.detailsText}>Bus ID:  </Text>
            <Text style={styles.detailsText1}>{scheduleDetails.bus_id}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"Flex-start"}}>
            <Text style={styles.detailsText}>Type:      </Text>
            <Text style={styles.detailsText1}>{scheduleDetails.unit_type}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"Flex-start"}}>
            <Text style={styles.detailsText}>Class:    </Text>
            <Text style={styles.detailsText1}>{scheduleDetails.bus_class}</Text>
          </View>
        </View>

        {/* Seat selection */}
        <View style={styles.seatContainer}>
          <Pressable
            style={[styles.seatButton, { backgroundColor: isPressed1? '#03346e' : '#0079c1' }]}
            onPressIn={() => setIsPressed1(true)}
            onPressOut={() => setIsPressed1(false)}
            
            
            
            onPress={() => navigation.navigate('seatSelect', {
              scheduleID,
               // Pass the callback function to handle seat selection
            })}
          >
            <Text style={styles.seatText}>Select Seat</Text>
          </Pressable>
          <View style={{flexDirection:"row", justifyContent:"Flex-start"}}>
          <Text style={styles.selectedSeat2}>Seat: </Text> 
          <Text  style={styles.selectedSeat}> {selectedSeat}</Text>
          </View>
        </View>
        {/* Display price */}
        <Text style={styles.routeText}>FARES</Text>
        <View style={{flexDirection:"row", justifyContent:"Flex-start"}}>
          <Text style={styles.label}>Ticket Price:   </Text>
          <Text style={styles.label1}>  P. {scheduleDetails.fare}</Text>
        </View>
        <View style={{flexDirection:"row", justifyContent:"Flex-start"}}>
          <Text style={styles.label}>App Discount:  </Text>
          <Text style={styles.label1}>10%</Text>
        </View>
        <Text style={styles.priceLabel}>Price:</Text>
        <Text style={styles.priceText}>P. {discountedFare.toFixed(2)}</Text>
      </View>
      {/* Pay Button */}
      <Pressable style={[styles.payButton,  { backgroundColor: isPressed ? 'gold' : '#fff' }]} onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}onPress={handlePay}>
        <Text style={styles.payButtonText}> <FontAwesome name="paypal" size={30} color='#0079c1'/> Pay<Text style={styles.payButtonText1}>Pal</Text>  </Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true} 
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.backIcon2} onPress={() => console.log("action")}>
          <Text style={styles.modalTitle2}>Payment Gateway</Text>
          </TouchableOpacity >
          <Text style={styles.modalTitle2}></Text>
            <PayPalWebView amount={discountedFare.toFixed(2)} transactionDetails={transactionDetails} onPaymentSuccess={handlePaymentSuccess}   />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#7AB2D3', // Blue background like the image
    paddingTop: "10%",
    
  },
  container1: {
    backgroundColor: '#7AB2D3', // Blue background like the image
    paddingTop: "10%",
    alignSelf:"center",
    fontSize:20,
    fontWeight:"500",
    letterSpacing:1,
    color:"#333"
    
  },
  Top: {
    flexDirection: "row",
    justifyContent: 'flex-start',
  },
  backIcon: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 1, 
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 15,
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 1, 
  },
  ticketCard: {
    backgroundColor: '#fff', // Dark card background
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth:2,
    borderColor:"#191970"
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4682B4',
  },
  routeDetails: {
    fontSize: 20,
    color: '#191970',
    marginBottom: 10,
    alignSelf:"center",
    fontWeight:"bold",
  },
  detailsText: {
    fontSize: 16,
    color: '#191970',
    marginVertical: 3,
  },
  detailsText1: {
    fontSize: 16,
    color: '#191970',
    marginVertical: 3,
    fontWeight:"bold",
  },
  seatContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 20,
    borderTopWidth: 2,
    borderColor: '#191970',
    paddingTop: 10,
  },
  seatButton: {
    backgroundColor: '#4682B4',
    padding: 10,
    borderRadius: 5,
  },
  seatText: {
    color: '#fff',
    fontSize: 15
  },
  selectedSeat: {
    color: '#191970',
    fontSize: 30,
    marginLeft: "5%",
  },
  selectedSeat2: {
    color: '#4682B4',
    fontSize: 30,
    marginLeft: "10%",
  },
  label: {
    fontSize: 14,
    color: '#191970',
    marginTop: 10,
    marginLeft:"15%"
  },
  label1: {
    fontSize: 14,
    color: '#191970',
    marginTop: 10,
    fontWeight:"bold"
  },
  priceLabel: {
    fontSize: 18,
    color: '#4682B4',
    fontWeight: 'bold',
    marginTop: 10,
  },
  priceText: {
    fontSize: 24,
    color: '#191970',
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft:"15%",
  },
  payButton: {
    backgroundColor: 'white', // Green button like in the image
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth:2,
    borderColor:"#191970"

  },
  payButtonText: {
    color: '#00457c',
    fontSize: 30,
    fontWeight:"bold",
    letterSpacing:0,
    fontStyle: 'italic'
  },
  payButtonText1: {
    color: '#0079c1',
    fontSize: 30,
    fontWeight:"bold",
    letterSpacing:0,
    fontStyle: 'italic'
  },


  modalContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '99%', height:"95%", backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  modalTitle2: { fontSize: 20, fontWeight: 'bold', marginBottom: 0, color:"#00457C"},
  closeButton: { marginTop: 20, padding: 10, backgroundColor: '#4682B4', borderRadius: 5 },
  closeButtonText: { color: '#fff' },
  backIcon2: {
    width:"100%",
    alignItems:"center",
    backgroundColor:"gold",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderColor:"#00457C"
    
    
  },
});

export default TicketDetailsScreen;
