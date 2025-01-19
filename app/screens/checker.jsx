import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { db, getDoc, doc } from '../firebaseconfig';

const SeatSelection = ({ route }) => {
  const { scheduleID } = route.params;
  const [seats, setSeats] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null); // Track selected seat

  // Dictionary to map row letters to numbers
  const rowMapping = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8,
    'i': 9, 'j': 10, 'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15, 'p': 16
  };
  const allRows = ['a', 'b', 'c', 'd', 'e', 'f', 'g']; // Add more rows as necessary

  // Fetch seat data from Firestore
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const scheduleDocRef = doc(db, 'BusSchedule', scheduleID);
        const scheduleDoc = await getDoc(scheduleDocRef);

        if (scheduleDoc.exists()) {
          const scheduleData = scheduleDoc.data();
          setSeats(scheduleData.seats || {});
        } else {
          console.log('No matching schedule found.');
        }
      } catch (error) {
        console.log('Error fetching seat data:', error);
      }
    };

    fetchSeats();
  }, [scheduleID]);

  // Handle seat selection, ensuring only one seat can be selected at a time
  const handleSeatSelect = (seatID) => {
    setSelectedSeat(seatID);  // Update the selected seat state
    console.log(`Selected seat: ${seatID}`);  // Print the selected seat to the console
  };

  const confirmSelection = () => {
    if (selectedSeat) {
      Alert.alert(`You have selected seat: ${selectedSeat}`);
    } else {
      Alert.alert('No seat selected', 'Please select a seat before confirming.');
    }
  };

  // Sort seats using the dictionary mapping for rows
  const sortSeats = (seats) => {
    let sortedSeats = {};
  
    // Iterate through each seat
    Object.keys(seats).forEach((seatID) => {
      let column = seatID.charAt(0);  // First character for column (number)
      let row = seatID.charAt(1);     // Second character for row (letter)
  
      // Initialize column if not yet created
      if (!sortedSeats[column]) {
        sortedSeats[column] = {};
      }
  
      // Initialize row array if not yet created within the column
      if (!sortedSeats[column][row]) {
        sortedSeats[column][row] = [];
      }
  
      // Push seatID into the correct row within the column
      sortedSeats[column][row].push(seatID);
    });
  
    // Now ensure that every column has all the rows from A to G, even if missing
    Object.keys(sortedSeats).forEach((column) => {
      allRows.forEach((row) => {
        if (!sortedSeats[column][row]) {
          sortedSeats[column][row] = null;  // Fill missing rows with null (or an empty array)
        }
      });
    });
  
    return sortedSeats;
  };

  const renderSeats = () => {
    let seatElements = [];
    const sortedSeats = sortSeats(seats);
    
  
    // Iterate over columns first and then rows within each column
    Object.keys(sortedSeats).forEach((column) => {
      let columnElements = [];
  
      // Iterate through each row within the current column
      allRows.forEach((row) => {
        const seatID = sortedSeats[column][row] && sortedSeats[column][row][0];
  
        if (seatID) {
          const status = seats[seatID];  // Available or Reserved
          const isDisabled = status === 'Reserved';
  
          columnElements.push(
            <TouchableOpacity
              key={seatID}
              style={[
                styles.seatButton,
                selectedSeat === seatID ? styles.selectedSeat : null,  // Apply red if selected
                isDisabled ? styles.reservedSeat : null,  // Apply grey if reserved
              ]}
              onPress={() => !isDisabled && handleSeatSelect(seatID)}
              disabled={isDisabled}
            >
              <Text style={styles.seatText}>{seatID}</Text>
            </TouchableOpacity>
          );
        } else {
          // Render an empty placeholder if the seatID is null
          columnElements.push(
            <View key={`empty-${column}-${row}`} style={styles.emptySeatPlaceholder}></View>
          );
        }
      });
  
      // Add column elements to the grid
      seatElements.push(
        <View key={`column-${column}`} style={styles.seatColumn}>
          {columnElements}
        </View>
      );
    });
  
    return seatElements;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select a Seat</Text>

      <View style={styles.seatGrid}>
        {renderSeats()}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={confirmSelection}>
        <Text style={styles.confirmText}>Confirm Seat</Text>
      </TouchableOpacity>

      {selectedSeat && (
        <Text style={styles.selectedSeatText}>Selected Seat: {selectedSeat}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptySeatPlaceholder: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: 'transparent', // Transparent to show as a gap
  },
  container: {
    paddingTop: "10%",
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#fff",
    flex:1
  },
  title: {
    fontSize: 30,
    fontWeight:'bold',
    marginBottom: 20,
    color:"#191970",
  },
  seatGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor:"#C0C0C0",
    padding:5,
    borderRadius: 10,
  },
  seatColumn: {
    flexDirection: 'column',
    marginHorizontal: 10,
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
    width:100
  },
  reservedSeat: {
    backgroundColor: 'grey',
  },
  confirmButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: "20%",
    paddingVertical:"5%",
    borderRadius: 5,
    marginTop: 20,
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
  },
  selectedSeatText: {
    marginTop: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default SeatSelection;
