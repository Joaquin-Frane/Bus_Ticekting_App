import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable, BackHandler } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';

const TicketInfo = () => {
    const [ticketInfo, setTicketInfo] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { itemId, tripId } = route.params;
    const db = getFirestore();
    const { user, userData } = useUser();
    const [isPressed, setIsPressed] = useState(false);

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
    
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const ticketDocRef = doc(db, `MobileUser/${user.uid}/Purchase`, itemId);
                const ticketDoc = await getDoc(ticketDocRef);

                if (ticketDoc.exists()) {
                    const ticketData = ticketDoc.data();
                    const tripDocRef = doc(db, 'tripInfo', tripId);
                    const tripDoc = await getDoc(tripDocRef);
                    const tripData = tripDoc.exists() ? tripDoc.data() : null;

                    setTicketInfo({
                        ...ticketData,
                        tripInfo: tripData
                    });
                } else {
                    console.log('No such ticket document!');
                }
            } catch (error) {
                console.error('Error fetching ticket info:', error);
            }
        };

        fetchTicketData();
    }, [itemId, tripId, user]);
    // Generate the QR code image URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=Transaction+ID:+${itemId}&size=170x170`;

    if (!ticketInfo) {
        return <Text style={styles.loading}>Loading ticket information...</Text>;
    }

    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>TICKET RECEIPT</Text>
            
            <View style={styles.qrContainer}>
                <View style={styles.ticketIdContainer}>
                    <Text style={styles.ticketId}>TRN: {itemId}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.routeText}>{ticketInfo.tripInfo?.route || 'Destination'}</Text>
                </View>
                
                <View style={styles.qrCode}>
                    <Image source={{ uri: qrCodeUrl }} style={{ width: 170, height: 170 }} />
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: "#191970" }}>Bus ID: </Text>
                        <Text style={{ color: "#191970" }}>{ticketInfo.tripInfo?.bus_id}</Text>
                    </View>
                </View>

                {/* Trip Info */}
                <View style={styles.tripInfo}>
                    <Text style={styles.tripInfoHeader}>Trip Info:</Text>
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "3%" }}>
                            <View>
                                <View style={styles.row1}>
                                    <Text style={styles.infoText}>Date:   </Text>
                                    <Text style={styles.infoValue}>{ticketInfo.tripInfo?.departure_date}</Text>
                                </View>

                                <View style={styles.row1}>
                                    <Text style={styles.infoText}>Class: </Text>
                                    <Text style={styles.infoValue}>{ticketInfo.tripInfo?.class}</Text>
                                </View>

                                <View style={styles.row1}>
                                    <Text style={styles.infoText}>Price:  </Text>
                                    <Text style={styles.infoValue}>{ticketInfo.price} PHP</Text>
                                </View>
                            </View>

                            <View>
                                <View style={styles.row1}>
                                    <Text style={styles.infoText}>Time: </Text>
                                    <Text style={styles.infoValue}>{ticketInfo.tripInfo?.departure_time}</Text>
                                </View>

                                <View style={styles.row1}>
                                    <Text style={styles.infoText}>Seat:  </Text>
                                    <Text style={styles.infoValue}>{ticketInfo.tripInfo?.bus_seat}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Passenger Info */}
                <View style={styles.passengerInfo}>
                    <Text style={styles.passengerInfoHeader}>Passenger Info:</Text>
                    <View style={styles.row1}>
                        <Text style={styles.infoText1}>Name: </Text>
                        <Text style={styles.infoText2}>{userData.first_name} {userData.last_name}</Text>
                    </View>

                    <View style={styles.row1}>
                        <Text style={styles.infoText1}>ID:</Text>
                        <Text style={styles.infoText1}>{user.uid}</Text>
                    </View>
                </View>
            </View>

            {/* Return Button */}
            <Pressable style={[styles.returnButton,  { backgroundColor: isPressed ? '#999' : '#191970' }]} 
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Return</Text>
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: "10%",
        paddingHorizontal: 10,
    },
   
    header: {
        fontSize: 24,
        color: '#191970',
        marginBottom: 10,
        fontWeight: '900',
        marginTop:10,
        letterSpacing:2,
    },
    qrContainer: {
        backgroundColor: '#4682B4',
        paddingVertical:10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    ticketIdContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ticketId: {
        color: '#fff',
        marginBottom: 10,
    },
    box: {
        backgroundColor: '#fff',
        width:"100%",
        marginBottom: 10,
        marginTop:0,
        paddingVertical:4,
        borderRadius:10
    },
    routeText: {
        fontSize: 28,
        color: '#191970',
        fontWeight: 'bold',
        alignSelf:"center",
    },
    qrCode: {
        marginBottom: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop:15,
        paddingBottom:5
    },
    tripInfoHeader: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tripInfo: {
        width: '100%',
        borderTopWidth:2,
        borderTopColor: "#fff",
        paddingBottom:20,
        paddingTop:5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 18,
        color: '#fff',
    },
    infoText1: {
        fontSize: 16,
        color: '#fff',
        marginLeft:"3%",
        marginBottom:5
    },
    infoText2: {
        fontSize: 16,
        color: '#fff',
        marginLeft:"3%",
        marginBottom:5,
        fontWeight:"bold"
    },
    infoValue: {
        fontSize: 18,
        color: '#fff',
        fontWeight:"bold"
    },
    passengerInfoHeader: {
        fontSize: 18,
        color: '#fff',
        marginVertical: 0,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    passengerInfo: {
        alignSelf: 'stretch',
        paddingBottom:10,
        paddingTop:5,
        borderTopWidth:2,
        borderTopColor:"#fff"
    },
    returnButton: {
        marginTop: 10,
        backgroundColor: '#191970',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing:2
    },
    loading:{
        fontWeight:"500",
        fontSize:20,
        marginTop:"20%",
        alignSelf:"center",
        letterSpacing:1,
        color:"#555",
    },
});

export default TicketInfo;
