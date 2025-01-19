import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../firebaseconfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const TicketBookingScreen = ({ navigation, route }) => {
  const { predefinedRoute, predefinedDate } = route.params || {};
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(predefinedRoute || '');
  const [show, setShow] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack(); // Go back to the previous screen
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);


  // Fetch Routes from Firestore (BusRoute collection)
  const fetchRoutes = async () => {
    try {
      const routeSnapshot = await getDocs(collection(db, 'BusRoutes'));  // Correct Firestore usage
      const routeList = routeSnapshot.docs.map(doc => doc.id);  // Assuming route names are document IDs
      setRoutes(routeList);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };
  
  // Fetch Schedules from Firestore based on selected route and date
  const fetchSchedules = async (route, date) => {
    console.log('Fetching schedules for route:', route, 'and date:', date); // Debugging log
    const finalDate = date || formatToLocalDate(new Date());
    try {
      const q = query(
        collection(db, 'BusSchedule'), 
        where('route', '==', route),
        where('departure_date', '==', finalDate),
        where('status', '!=', 'Cancelled')
      );
      const scheduleSnapshot = await getDocs(q);
  
      if (scheduleSnapshot.empty) {
        console.log('No matching documents found for:', date);
        Toast.show({
          type: 'warning',
          text1: 'No Schedule Found ',
          text2: 'Select a different Date or Route.',
          visibilityTime: 3000
        });
      } else {
        console.log('Documents fetched:', scheduleSnapshot.docs.map(doc => doc.data()));
      }
  
      const scheduleList = scheduleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchedules(scheduleList);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  useEffect(() => {
    if (!selectedDate) {
      const today = formatToLocalDate(new Date());
      setSelectedDate(today);
      setDate(new Date()); // Sync the state for the date picker
    }
  }, []);
  
  // Fetch schedules whenever route or date changes
  useEffect(() => {
    if (selectedRoute) {
      fetchSchedules(selectedRoute, selectedDate);
    }
  }, [selectedRoute, selectedDate]);

  const formatToLocalDate = (date) => {
    // Account for time zone offset to ensure local time is used
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  // Set default date consistently
  const [selectedDate, setSelectedDate] = useState(predefinedDate ? formatToLocalDate(new Date(predefinedDate)) : formatToLocalDate(new Date()));
  const [date, setDate] = useState(predefinedDate ? new Date(predefinedDate) : new Date());
  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  
    // Debugging logs for selected date
    console.log('Selected Date (raw):', currentDate);
  
    const formattedDate = formatToLocalDate(currentDate);
    console.log('Formatted Date (local):', formattedDate);
  
    setSelectedDate(formattedDate);
  };


  const showDatePicker = () => {
    setShow(true);
  };

  // Fetch routes when component mounts
  useEffect(() => {
    fetchRoutes();
  }, []);

  // Fetch schedules whenever route or date changes
  useEffect(() => {
    if (selectedRoute && selectedDate) {
      fetchSchedules(selectedRoute, selectedDate);
    }
  }, [selectedRoute, selectedDate]);

  const handlePress = (scheduleId) => {
    const selectedSchedule = schedules.find(schedule => schedule.id === scheduleId);
    // If no schedule is found, handle it gracefully
    if (!selectedSchedule) {
      console.log("Schedule not found for the provided ID");
      return;
    }
  
    // Check if the "seats" field exists and contains available values
    const seats = selectedSchedule.seats;  // Assuming "seats" is a field in the schedule object
    if (seats) {
      const isFullyBooked = Object.values(seats).every(value => value !== 'Available');
      console.log("Is schedule fully booked?", isFullyBooked);
  
      if (isFullyBooked) {
        setIsModalVisible(true);
      } else {
        navigation.navigate('seat', { scheduleID: selectedSchedule.id });
      }
    } else {
      console.log("Seats field not found in schedule");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <View style={styles.Top}>
        <AntDesign name="arrowleft" size={40} color="white" style={styles.backIcon} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>BUY TICKET</Text>
      </View>

      <View style={styles.container1}>
      {/* Date Picker */}
      <Text style={styles.label}>Date:</Text>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.calendarButton}>
          <AntDesign name="calendar" size={27} color="white" />
        </TouchableOpacity>
      </View>
      
      {show && ( <DateTimePicker value={date} mode="date" display="default" onChange={onChange} />)}

      {/* Route Dropdown */}
      <Text style={styles.label}>Route:</Text>
      <View style={styles.pickerWrapper}>
        <Picker 
          selectedValue={selectedRoute}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedRoute(itemValue)}
        >
          <Picker.Item label="Select Route" value="" />
          {routes.map((route, index) => (
            <Picker.Item key={index} label={route} value={route} />
          ))}
        </Picker>
      </View>

      {/* Schedule List (ScrollView with clickable boxes) */}
      <Text style={styles.label}>Select Schedule:</Text>
      <View style={styles.scheduleList}>
      <ScrollView  showsVerticalScrollIndicator={false}>
        {schedules.map((schedule) => (
          <TouchableOpacity key={schedule.id} style={styles.scheduleBox} onPress={() => handlePress(schedule.id)} >
            
            <View style={{flexDirection:"row"}}>
                <Text style={styles.scheduleText}>Route:  </Text>
                <Text style={styles.route1}>{schedule.route}</Text>
            </View>

            <View style={{flexDirection:"row"}}>
                <Text style={styles.scheduleText}>Time:   </Text>
                <Text style={styles.route1}>{schedule.departure_time}</Text>
            </View>

            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
              <View style={{flexDirection:"row"}}>
                <Text style={styles.scheduleText}>Unit:     </Text>
                <Text style={styles.route1}>{schedule.bus_id}</Text>
              </View>
              
              <View style={{flexDirection:"row"}}>
                <Text style={styles.scheduleText}>Class:   </Text>
                <Text style={styles.route1}>{schedule.bus_class}</Text>
              </View>
            </View>
            
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      </View>

      {/* Next Button
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('seat', { scheduleID: selectedScheduleId })}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity> */}
      <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalText}>This trip is fully booked!</Text>
                  <TouchableOpacity  style={styles.closeButtonf} onPress={() => setIsModalVisible(false)}>
                      <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
    paddingHorizontal: 10,
    backgroundColor: '#7AB2D3',
    paddingBottom: "5%"
  },
  container1: {
    flex: 1,
    paddingHorizontal:20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius:20,
    borderWidth:2,
    borderColor:"#191970"
  },
  Top: {
    flexDirection: "row", 
    justifyContent: 'flex-start',
  },
  title: {
    color:"#fff",
    fontSize: 35,
    fontWeight:"bold",
    paddingHorizontal: 10,
    paddingVertical: 15,
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 1, 
  },
  backIcon: {
    paddingVertical: 20,
    paddingHorizontal: 10, 
    textShadowColor: '#191970',        // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 1, 
  },
  label: {
    fontSize: 18,
    color: '#191970',
    marginVertical: 5,
    fontWeight:'bold',
    marginLeft:"5%",
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth:2,
    borderColor:"#191970"
  },
  dateText: {
    color: '#191970',
    fontSize: 16,
  },
  calendarButton: {
    padding: 6,
    backgroundColor: '#191970',
    borderRadius: 5,
  },
  pickerWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth:2,
    borderColor:"#191970",
    paddingVertical:"0.5%",
    paddingHorizontal:"0.5%"
  },
  picker: {
    color: '#191970',
  },
  scheduleList: {
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 10,
    flex: 1,
    borderWidth:2,
    borderColor:"#191970",
  },
  scheduleBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  route: {
    fontSize: 16,
    color: '#191970',
    paddingBottom:5
  },
  route1: {
    fontSize: 16,
    color: '#191970',
    paddingBottom:5,
    fontWeight:"bold"
  },
  scheduleText: {
    fontSize: 16,
    color: '#4682B4',
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginHorizontal:"20%",
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#191970',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
},
modalText: {
    fontSize: 20,
    color: '#191970',
    marginBottom: 20,
    marginTop: 20,
    fontWeight: '700',
    letterSpacing:1,
},
closeButton: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
},
closeButtonf: {
    paddingHorizontal:20,
   backgroundColor: '#6eacda',
   paddingVertical:5,
   borderRadius:10,
   marginVertical:10,
},
});

export default TicketBookingScreen;
