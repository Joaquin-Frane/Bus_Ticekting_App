{/*import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { getDocs, collection } from "firebase/firestore"; // Firebase Firestore functions
import { db } from './firebaseConfig'; // Your Firebase configuration file

// Request notification permissions
const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications not granted!');
  }
};

// Schedule a local notification
const scheduleNotification = async (title, body, triggerDate) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
      },
      trigger: triggerDate, // Date object or interval in seconds
    });
    console.log('Notification scheduled for:', triggerDate);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// Fetch data from Firebase and schedule notifications
const fetchAndScheduleNotifications = async (userId) => {
  try {
    // Get the user's "Purchase" subcollection
    const purchaseRef = collection(db, `users/${userId}/Purchase`);
    const querySnapshot = await getDocs(purchaseRef);

    querySnapshot.forEach((doc) => {
      const purchaseData = doc.data();
      const { departureDate, departureTime, route } = purchaseData;

      if (departureDate && departureTime) {
        // Combine departure date and time into a single Date object
        const departureDateTime = new Date(`${departureDate}T${departureTime}`);

        // Calculate the notification time (3 days before departure)
        const notificationTime = new Date(departureDateTime.getTime() - 3 * 24 * 60 * 60 * 1000);

        // Ensure the notification time is in the future
        if (notificationTime > new Date()) {
          // Schedule the notification
          scheduleNotification(
            `Reminder: Upcoming Trip on ${route}`,
            `Your trip to ${route} is scheduled for ${departureDateTime.toLocaleString()}.`,
            notificationTime
          );
        }
      }
    });
  } catch (error) {
    console.error('Error fetching purchase data or scheduling notifications:', error);
  }
};

// Main component
const Notif = () => {
  useEffect(() => {
    // Request notification permissions when the app loads
    requestNotificationPermissions();

    // Replace with the logged-in user's ID
    const userId = "exampleUserId";

    // Fetch data and schedule notifications
    fetchAndScheduleNotifications(userId);
  }, []);

  return null; // This is just a background task; no UI here
};

export default Notif;*/}
