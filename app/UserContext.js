// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, getDoc, doc, updateDoc } from './firebaseconfig'; // Use the auth instance from firebaseconfig
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const UserContext = createContext();

// Custom hook for easy access to the UserContext
export const useUser = () => useContext(UserContext);

// Provider component that wraps around your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // To manage loading state

  useEffect(() => {
    // Listen for changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const userDoc = await getDoc(doc(db, 'MobileUser', currentUser.uid)); // Adjust collection as needed
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Function to update user data in the database
  const updateUserData = async (newData) => {
    if (!user) {
      console.error('No user is logged in');
      return;
    }

    try {
      // Update the user's document in Firestore
      const userRef = doc(db, 'MobileUser', user.uid); // Adjust collection as needed
      await updateDoc(userRef, newData);

      // Update local state with the new data
      setUserData((prevUserData) => ({
        ...prevUserData,
        ...newData,
      }));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const logout = async () => {
    try {
      // Clear AsyncStorage to remove user data
      await AsyncStorage.removeItem('user');
      setUserData(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, userData, setUserData, updateUserData, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
