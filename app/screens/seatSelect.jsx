import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert , BackHandler} from 'react-native';
import { db, getDoc, doc } from '../firebaseconfig';
import Toast from 'react-native-toast-message';

const SeatSelection = ({ route, navigation }) => {
  const { scheduleID } = route.params;
  const [seats, setSeats] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);

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


  const handleSeatSelect = (seatID) => {
    setSelectedSeat(seatID);
    Toast.show({
      type: 'info',
      text1: `Seat Selected: ${seatID}`,
      position: 'top',
      visibilityTime: 4000,
    });
  };

  const rowMapping = { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8 };
  const allRows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const scheduleDocRef = doc(db, 'BusSchedule', scheduleID);
        const scheduleDoc = await getDoc(scheduleDocRef);

        if (scheduleDoc.exists()) {
          setSeats(scheduleDoc.data().seats || {});
        } else {
          console.log('No matching schedule found.');
        }
      } catch (error) {
        console.log('Error fetching seat data:', error);
      }
    };
    fetchSeats();
  }, [scheduleID]);

  const confirmSelection = () => {
    if (selectedSeat) {
      
      navigation.navigate('seat', {scheduleID, selectedSeat });
    } else {
      Toast.show({
        type: 'error',
        text1: `No seat selected`,
        text2: 'Please select a seat before confirming.',
        position: 'top',
        visibilityTime: 4000,
      });
      //Alert.alert('No seat selected', 'Please select a seat before confirming.');
    }
  };

  const sortSeats = (seats) => {
    let sortedSeats = {};
    Object.keys(seats).forEach((seatID) => {
      let column = seatID.charAt(0);
      let row = seatID.charAt(1);
      if (!sortedSeats[column]) {
        sortedSeats[column] = {};
      }
      if (!sortedSeats[column][row]) {
        sortedSeats[column][row] = [];
      }
      sortedSeats[column][row].push(seatID);
    });
    Object.keys(sortedSeats).forEach((column) => {
      allRows.forEach((row) => {
        if (!sortedSeats[column][row]) {
          sortedSeats[column][row] = null;
        }
      });
    });
    return sortedSeats;
  };

  const renderSeats = () => {
    let seatElements = [];
    const sortedSeats = sortSeats(seats);
    Object.keys(sortedSeats).forEach((column) => {
      let columnElements = [];
      allRows.forEach((row) => {
        const seatID = sortedSeats[column][row] && sortedSeats[column][row][0];
        if (seatID) {
          const status = seats[seatID];
          const isDisabled = status !== 'Available';
          columnElements.push(
            <TouchableOpacity
              key={seatID}
              style={[
                styles.seatButton,
                selectedSeat === seatID ? styles.selectedSeat : null,
                isDisabled ? styles.reservedSeat : null,
              ]}
              onPress={() => !isDisabled && handleSeatSelect(seatID)}
              disabled={isDisabled}
            >
              <Text style={styles.seatText}>{seatID}</Text>
            </TouchableOpacity>
          );
        } else {
          columnElements.push(
            <View key={`empty-${column}-${row}`} style={styles.emptySeatPlaceholder}></View>
          );
        }
      });
      seatElements.push(
        <View key={`column-${column}`} style={styles.seatColumn}>
          {columnElements}
        </View>
      );
    });
    return seatElements;
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Select a Seat</Text>
        <View style={styles.seatGrid}>{renderSeats()}</View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.confirmButton} onPress={confirmSelection}>
          <Text style={styles.confirmText}>Select Seat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingTop: '10%',
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#191970',
  },
  seatGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: '#C0C0C0',
    padding: 5,
    borderRadius: 10,
  },
  seatColumn: {
    flexDirection: 'column',
    marginHorizontal: 5,
  },
  seatButton: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: '#191970',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  seatText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedSeat: {
    backgroundColor: 'red',
  },
  reservedSeat: {
    backgroundColor: 'grey',
  },
  emptySeatPlaceholder: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: 'transparent',
  },
  bottomBar: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor:"#191970"
  },
  confirmButton: {
    backgroundColor: '#6eacda',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    width:200,
    alignItems:"center"
  },
  confirmText: {
    color: 'white',
    fontSize: 25,
    letterSpacing:1,
    textShadowColor: '#191970',        // Shadow color
  },
});

export default SeatSelection;
