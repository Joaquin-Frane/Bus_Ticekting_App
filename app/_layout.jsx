import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native';
import LoginPage from './screens/SetLogin';
import SignUpPage from './screens/SignUp';
import SignInPage from './screens/SignIn';
import DashboardScreen from './screens/dash';
import ProfilePage from './screens/profile';
import { UserProvider  } from './UserContext';// Adjust the path as needed
import TicketInfo from './screens/viewtckt';
import TicketInfo2 from './screens/viewtickt2';
import TicketBookingScreen from './screens/book';
import TicketDetailsScreen from './screens/seat';
import SeatSelection from './screens/seatSelect';
import YourComponent from './screens/dataInjection';
import ForgotPassword from './screens/changepass';
import AboutUs from './screens/about';
import NotificationScreen from './screens/NotificationList';
import NotificationDetailsScreen from './screens/NotificationView';
import Devs from './screens/devs';
import Guide from './screens/theguide';
import TheAbout from './screens/thecompany';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';


const toastConfig = {
  success: (props) => (
    <BaseToast
    {...props}
    style={{
      position: 'absolute',   // Ensure it's in a fixed position
      top: 50,                // Adjust the vertical position
      zIndex: 9999,           // Make sure it's above other elements
      left: 0,
      right: 0,
      borderLeftColor: '#2c7721',
      borderLeftWidth: 10,
      backgroundColor: "#76bf4c",
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,   // Add margin for aesthetics
    }}
    contentContainerStyle={{ paddingHorizontal: 15 }}
    renderLeadingIcon={() => (
      <AntDesign name="checkcircleo" size={30} color="#fff" style={{ marginLeft: "3%" }} />
    )}
    text1Style={{
      fontSize: 20,
      color: 'white'
    }}
    text2Style={{
      fontSize: 12,
      color: 'white',
      flexWrap: 'wrap',  // Allow text to wrap
      width: '90%',      // Ensure enough width for wrapping
    }}
    />
  ),
  
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        position: 'absolute',
        top: 50,
        zIndex: 9999,
        left: 0,
        right: 0,
        borderLeftColor: '#c81912ed',
        borderLeftWidth: 10,
        backgroundColor: "#f63e50",
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderLeadingIcon={() => (
        <Ionicons name="close-circle-outline" size={40} color="#fff" style={{ marginLeft: "3%" }} />
      )}
      text1Style={{
        fontSize: 17,
        color: 'white'
      }}
      text2Style={{
        fontSize: 12,
        color: 'white',
        flexWrap: 'wrap',  // Allow text to wrap
        width: '90%',      // Ensure enough width for wrapping
      }}

    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#65acf0',
        borderLeftWidth: 20,
        marginTop: "15%",
        height: "80%",
        backgroundColor: "#fff",
        flexDirection: 'row',
        alignItems: 'center',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderLeadingIcon={() => (
        <AntDesign name="exclamationcircleo" size={30} color="#65acf0" style={{ marginLeft: "3%" }} />
      )}
      text1Style={{
        fontSize: 20,
        color: '#4682B4'
      }}
      text2Style={{
        fontSize: 12,
        color: '#4682B4',
        flexWrap: 'wrap',  // Allow text to wrap
        width: '90%',      // Ensure enough width for wrapping
      }}
    />
  ),

  warning: (props) => (
    <BaseToast
      {...props}
      style={{
        position: 'absolute',
        top: 50,
        zIndex: 9999,
        left: 0,
        right: 0,
        borderLeftColor: '#b15500',
        borderLeftWidth: 10,
        backgroundColor: "#f88f01",
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderLeadingIcon={() => (
        <Feather name="alert-triangle" size={30} color="#fff" style={{ marginLeft: "3%" }} />
      )}
      text1Style={{
        fontSize: 20,
        color: 'white'
      }}
      text2Style={{
        fontSize: 12,
        color: 'white',
        flexWrap: 'wrap',  // Allow text to wrap
        width: '90%',      // Ensure enough width for wrapping
      }}
    />
  ),
  
  tomatoToast: ({ text1, props }) => (

    <View style={{ height: 60, width: '100%', marginTop: "15%",paddingHorizontal: 15, backgroundColor: '65acf0', flexDirection: 'row', alignItems: 'center', padding: 10, borderLeftColor: '#1474bc', borderLeftWidth: 10, }}>
      <AntDesign name="exclamationcircleo" size={30} color="#fff" style={{ marginLeft: "3%" }} />
      <View>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{text1}</Text>
        <Text style={{ color: 'white', fontSize: 15}}>{props.uuid}</Text>
      </View>
    </View>
  )
};


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


// Move the components outside of the inline function
function Item1Screen() {
  return <View><Text>This is Item 1!</Text></View>;
}

function Item2Screen() {
  return <View><Text>This is Item 2!</Text></View>;
}

// Drawer specific for the Dashboard
function DashboardDrawer() {
  return (
    <Drawer.Navigator initialRouteName="DashboardScreen" screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Item1" component={Item1Screen} />
      <Drawer.Screen name="Item2" component={Item2Screen} />
    </Drawer.Navigator>
  );
}

function HomeScreen({ navigation }) {
  return (
    
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Ceres.Co</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Go to Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
      <Button
        title="Go to Sign In"
        onPress={() => navigation.navigate('SignIn')}
      />
      <Toast />
    </SafeAreaView>
  );
}

export default function App() {
  
  return (
    <UserProvider>
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="book" component={TicketBookingScreen} />
        <Stack.Screen name="seat" component={TicketDetailsScreen} />
        <Stack.Screen name="seatSelect" component={SeatSelection} />
        <Stack.Screen name="TicketDisplay" component={YourComponent} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        {/* This Stack.Screen uses DashboardDrawer, which contains the Drawer for the dashboard */}
        <Stack.Screen name="dash" component={DashboardDrawer} />
        <Stack.Screen name="prof" component={ProfilePage} />
        <Stack.Screen name="TicketInfo" component={TicketInfo} />
        <Stack.Screen name="TicketInfo2" component={TicketInfo2} />
        <Stack.Screen name="About" component={AboutUs} />
        <Stack.Screen name="Notif" component={NotificationScreen} />
        <Stack.Screen name="NotifView" component={NotificationDetailsScreen} />

        <Stack.Screen name="Devs" component={Devs} />
        <Stack.Screen name="Guide" component={Guide} />
        <Stack.Screen name="TheCompany" component={TheAbout} />
      </Stack.Navigator>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 , elevation:0}}>
          <Toast config={toastConfig} />
      </View>
      
    </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
