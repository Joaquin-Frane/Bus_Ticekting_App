import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable, BackHandler, PermissionsAndroid, Platform, VirtualizedList, Linking } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
//import * as Print from 'expo-print';
//import * as FileSystem from 'expo-file-system';
//import * as Sharing from 'expo-sharing';
import { FontAwesome5} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const TicketInfo2 = () => {
    const [ticketInfo, setTicketInfo] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { itemId, tripId } = route.params;
    const db = getFirestore();
    const { user, userData } = useUser();
    const [isPressed, setIsPressed] = useState(false);
    const [isPressed1, setIsPressed1] = useState(false);

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('dash');
            return true;
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
                    const ticketData = ticketDoc.data() || {};
                    const tripDocRef = doc(db, 'tripInfo', tripId);
                    const tripDoc = await getDoc(tripDocRef);
                    const tripData = tripDoc.exists() ? tripDoc.data() : {};
                    
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

    // Function to request storage permissions (Android only)
    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Storage Permission",
                    message: "App needs access to your storage to save PDF file",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Storage permission granted");
            } else {
                console.log("Storage permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const generatePDF = async () => {
        if (!ticketInfo) return;
        if (Platform.OS === 'android') {
            requestStoragePermission();
        }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=Transaction+ID:+${itemId}&size=170x170`;
    const transactionDate = ticketInfo?.transaction_date.toDate();

    // Format date and time separately
    const formattedDate = transactionDate.toLocaleDateString(); // e.g., "10/1/2024"
    const formattedTime = transactionDate.toLocaleTimeString(); // e.g., "2:00 AM"
    
    const htmlContent = `
        <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bus Ticket</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        color: #000;
          text-align: center;
          margin: 0;
          padding: 0;
          background-color: #fff;
        }
        .ticket-container {
          width: 300px;
          margin: 20px auto;
          padding: 10px;
          border: 1px solid #000;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
        }
        .header {
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
        }
        .header-image img {
        max-width: 100%; /* Ensures the image fits within the container width */
        height: auto; /* Maintains aspect ratio */
        display: block;
        margin: 0 auto;
        }
        .separator {
        font-size: 20px;
        color: #000;
        margin: 10px 0;
        }
        .qr-code {
        margin: 20px 0;
        }
        .route-info {
          font-weight: bold;
          margin-bottom: 25px ;
           text-align: left;
        }
        .route-info2 {
        font-size: 20px;
        margin: 10px 0;
     
        }
        .details {
          font-size: 14px;
          line-height: 1.6;
          text-align: left;
          margin: 10px auto;
          width: 80%;
        }
        .details2 {
          font-size: 11px;
          line-height: 1.0;
          text-align: left;
          width: 95%;
        }
        .details p {
          margin: 5px 0;
        }
        .detail1 {
          margin: -5px 0px;
          margin-bottom: 20px 0;
        }
        .footer {
          font-size: 14px;
          margin-top: 20px;
          font-weight: bold;
        }
        .inspection-note {
          font-size: 12px;
          font-weight: bold;
          margin-top: 20px;
        }
        </style>
    </head>
    <body>

    <div class="ticket-container">
    
        <!-- Header Image -->
        <div class="header-image">
            <img src="https://i.ibb.co/N6NX0Fy/New-Project-11.png" alt="Company Logo"/>
        </div>

        <!-- Separator Line -->
        <div class="separator">***********************************</div>

        <!-- Transaction Information -->
        <div class="details2">
            <p><strong>Transaction ID:</strong>  ${itemId}</p>
            <p><strong>Date:</strong>&nbsp;&nbsp;&nbsp; ${formattedDate} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Time:</strong>&nbsp;&nbsp;&nbsp; ${formattedTime}</p>
        </div>

        <!-- QR Code -->
        <div class="qr-code">
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=Transaction+ID:+${itemId}&size=200x200" alt="QR Code" width="200" height="200"/>
        </div>
        <div class="separator">***********************************</div>

        <!-- Route Information -->
        <div class="route-info">${ticketInfo?.route}</div>

        <!-- Additional Information -->
        <div class="details">
            <p><strong>Bus ID:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ticketInfo.tripInfo?.bus_id}</p>
            <p><strong>Date:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ticketInfo?.departure_date}</p>
            <p><strong>Time:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ticketInfo?.departure_time}</p>
            <p><strong>Class:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ticketInfo.tripInfo?.class}</p>
            <p><strong>Discount:</strong>&nbsp;&nbsp;&nbsp;&nbsp;${ticketInfo?.discount}</p>
        </div>

        <!-- Separator Line -->
        <div class="separator">***********************************</div>

        <!-- Seat and Price Information -->
        <div class="details">
            <p class="route-info2"><strong>Seat:      &nbsp;&nbsp;&nbsp;&nbsp;${ticketInfo?.bus_seat}</strong></p>
            <p class="route-info2"><strong>PHP.     &nbsp;&nbsp;&nbsp;&nbsp;${ticketInfo?.price}</strong></p>
   
        </div>
    <div class="separator">***********************************</div>
        <!-- Footer Message -->
        <div class="inspection-note">
            <p>KEEP THE TICKET FOR INSPECTION</p>
            <p>THANK YOU!!!</p>
        </div>
    
    </div>

    </body>
    </html>
    `;

    try {
        const { uri } = await Print.printToFileAsync({
            html: htmlContent
        });

        console.log(`PDF saved at: ${uri}`);

        // Get the app's document directory path
        const documentDirectory = FileSystem.documentDirectory;

        // Define the path for saving the PDF file
        const pdfFilePath = documentDirectory + `${itemId}_ticket.pdf`;

        // Move the generated PDF to the document directory
        await FileSystem.moveAsync({
            from: uri,
            to: pdfFilePath,
        });

        console.log(`PDF saved in Document Directory at: ${pdfFilePath}`);

        // Share the file
        const result = await Sharing.shareAsync(pdfFilePath);
        if (result.success) {
            console.log('PDF shared successfully!');
        } else {
            console.log('PDF sharing failed.');
        }
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=Transaction+ID:+${itemId}&size=170x170`;

    if (!ticketInfo) {
        return <Text style={styles.loading}>Loading ticket information...</Text>;
    }


    const addToGoogleCalendar = () => {
        if (!ticketInfo || !ticketInfo.tripInfo) return;
    
        const { departure_date, departure_time, route, bus_id, bus_seat } = ticketInfo.tripInfo;
    
        // Function to convert 12-hour time (AM/PM) to 24-hour format
        const convertTo24Hour = (time12h) => {
            const [time, modifier] = time12h.split(" ");
            let [hours, minutes] = time.split(":");
    
            if (modifier === "PM" && hours !== "12") {
                hours = parseInt(hours, 10) + 12;
            } else if (modifier === "AM" && hours === "12") {
                hours = "00";
            } else {
                hours = hours.padStart(2, '0');
            }
    
            return `${hours}:${minutes}`;
        };
    
        const time24 = convertTo24Hour(departure_time.trim());
    
        // Combine departure date and time (local time)
        const startDate = `${departure_date}T${time24}:00`; // Use local time format
        const endDate = new Date(new Date(`${departure_date}T${time24}:00`).getTime() + 3600000)
            .toISOString()
            .replace('Z', ''); // Remove 'Z'
    
        const title = `Bus Trip: ${route}`;
        const location = 'Bus Terminal';
        const eventDetails = `
Departure Time: ${departure_time}
Bus No: ${bus_id}
Seat No: ${bus_seat}
        `.trim();
    
        // Custom reminders: 1 day before (1440 minutes)
        const reminders = `&trp=true&reminders=useDefault:false,overrides:[{method:"popup",minutes:1440}]`;
    
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title
        )}&location=${encodeURIComponent(
            location
        )}&dates=${startDate.replace(/-|:|\.\d+/g, '')}/${endDate.replace(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(
            eventDetails
        )}${reminders}`;
    
        Linking.openURL(calendarUrl).catch((err) =>
            console.error('Error opening calendar:', err)
        );
    };

    return (
        <View style={styles.container}>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between",  width:"100%", paddingBottom:5, }}>
                <Text style={styles.header}>Ticket Receipt</Text>
                <TouchableOpacity style={styles.addToCalendarButton} onPress={addToGoogleCalendar}>
                    <Image source={require("../assets/icons/left-w.png")} style={{ width: 35, height: 35, }} />
                    {/*<MaterialCommunityIcons name="bell-plus" size={30} color="#fff"  />*/}
                </TouchableOpacity>
            </View>
            
            
            <View style={styles.qrContainer}>
                <View style={styles.ticketIdContainer}>
                    <Text style={styles.ticketId}>TRN: {itemId}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.routeText}>{ticketInfo.tripInfo?.route || 'Destination'}</Text>
                </View>
               

                {/* QR Code */}
                <View style={styles.qrCode}>
                    <Image source={{ uri: qrCodeUrl }} style={{ width: 170, height: 170 }} />   
                    
                    <View style={{flexDirection:"row"}}>
                        <Text style={{color:"#191970"}}>Bus ID: </Text>
                        <Text style={{color:"#191970"}}>{ticketInfo.tripInfo?.bus_id}</Text>
                    </View>

                </View>

               

                {/* Trip Info */}
                <View style={styles.tripInfo}>
                <Text style={styles.tripInfoHeader}>Trip Info:</Text>
                    <View>
                        <View style={{flexDirection:"row", justifyContent:"space-between",marginHorizontal:"3%"}}>
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
                            <Text style={styles.infoText2}>{userData.first_name}  {userData.last_name}</Text>
                        </View>

                        <View style={styles.row1}>
                        <Text style={styles.infoText1}>ID:</Text>
                        <Text style={styles.infoText1}>{user.uid}</Text>
                        </View>
                </View>
            </View>

            {/* Return Button */}
            <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"100%",alignSelf:"center",paddingHorizontal:"5%"}}>
            <Pressable style={[styles.returnButton,  { backgroundColor: isPressed ? '#2eab13' : '#191970' }]} 
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={generatePDF}>
                <Text style={styles.buttonText}>Download <FontAwesome5 name="file-pdf" size={20} color="#fff"  /></Text>
            </Pressable>

            <Pressable style={[styles.returnButton,  { backgroundColor: isPressed1 ? '#999' : '#191970' }]} 
                onPressIn={() => setIsPressed1(true)}
                onPressOut={() => setIsPressed1(false)}
                onPress={() => navigation.navigate("dash")}>
                <Text style={styles.buttonText}> Return </Text>
            </Pressable>

            </View>
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
        fontSize: 26,
        color: '#191970',
        marginBottom: 10,
        fontWeight: 'bold',
        marginTop:10,
        letterSpacing:2,
        marginLeft:15
    },
    qrContainer: {
        backgroundColor: '#4682B4',
        paddingTop:10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        paddingBottom:0
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
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal:"5%",
        alignItems:"center"
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing:2,
        alignSelf:"center",
    }, 
    buttonText1: {
        color: '#191970',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing:2,
        alignSelf:"center",
    }, 
    loading: {
        fontSize: 20,
        color: '#555',
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing:1,
        marginTop:"20%",
    },
    addToCalendarButton: {
        backgroundColor: '#191970',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf:"center",
        marginHorizontal:15
      },
});

export default TicketInfo2;
