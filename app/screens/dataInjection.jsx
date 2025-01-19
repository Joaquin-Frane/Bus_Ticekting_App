import React, { useState } from 'react';
import { Button, Alert, View, Text, ScrollView } from 'react-native';
import { db } from '../firebaseconfig'; // Adjust the path as needed
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'react-native-uuid';
import { useUser } from '../UserContext'; // Import your UserContext

const YourComponent = ({ ticket }) => {
  const { userData } = useUser(); // Access userData from context
  const [ticketData, setTicketData] = useState(null); // To store and display the ticket data

  const handlePayWithPayPal = async () => {
    // Ensure ticket is an object
    if (typeof ticket !== 'object' || ticket === null) {
      Alert.alert("Error", "Invalid ticket data.");
      return;
    }

    // Generate IDs
    const tripID = uuidv4();
    const transactionID = uuidv4();
    const saleID = uuidv4();
    const currentTime = new Date();

    // Prepare data for Firestore
    const tripInfoData = {
      //TripID: tripID,
      //departure_time: ticket.Time_Schedule,
      //transaction_date: currentTime,
      //route: ticket.Route,
      //class: ticket.Class,
      //departure_date: ticket.Dept_Date,
      //bus_id: ticket.Bus_ID,
      //bus_seat: ticket.Seat,
      //account_id: userData ? userData.account_id : null, // Get account_id from userData
      //status: 'Active',
    };

    const transactionData = {
      //transactionID: transactionID,
      //TripID: tripID,
      //ScheduleID: ticket.ScheduleID,
      //discount: ticket.Discount,
      //price: parseFloat(ticket.Fare), // Ensure price is a float
      //mode: ticket.Mode,
      //transaction_date: currentTime,
      route: ticket.Route,
      status: 'Active',
      accountID: userData ? userData.account_id : null, // Get account_id from userData
    };

    const saleData = {
      //ID: saleID,
      //transactionID: transactionID,
      //TripID: tripID,
      //ScheduleID: ticket.ScheduleID,
      //price: parseFloat(ticket.Fare), // Ensure price is a float
      transaction_date: currentTime,
      account_id: userData ? userData.account_id : null, // Get account_id from userData
      terminal: 'MOBILE', // Replace with actual terminal location
      status: 'Payed',
    };

    try {
      // Save data to Firestore
      await setDoc(doc(db, 'tripInfo', tripID), tripInfoData);
      await setDoc(doc(db, 'transactions', transactionID), transactionData);
      await setDoc(doc(db, 'sales', saleID), saleData);

      console.log(transactionID)

      Alert.alert("Success", "Data saved successfully!");

      // Store the ticket data to display on the screen
      setTicketData(ticket);

    } catch (error) {
      console.error("Error saving data: ", error);
      Alert.alert("Error", "Failed to save data.");
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Button title="Pay with PayPal" onPress={handlePayWithPayPal} />

        {/* Display the ticket data if it exists */}
        {ticketData && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Ticket Details:</Text>
            <Text>Route: {ticketData.Route}</Text>
            <Text>Class: {ticketData.Class}</Text>
            <Text>Departure Date: {ticketData.Dept_Date}</Text>
            <Text>Departure Time: {ticketData.Time_Schedule}</Text>
            <Text>Bus ID: {ticketData.Bus_ID}</Text>
            <Text>Seat: {ticketData.Seat}</Text>
            <Text>Fare: {ticketData.Fare}</Text>
            <Text>Mode: {ticketData.Mode}</Text>
            <Text>Discount: {ticketData.Discount}</Text>
            <Text>Schedule ID: {ticketData.ScheduleID}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default YourComponent;
