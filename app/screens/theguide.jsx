import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Modal, Linking, BackHandler} from 'react-native';
import { useState, useEffect} from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Guide = () => {
  const [pressedButton, setPressedButton] = useState(null);
  const navigation = useNavigation();

  const [isSchedule, setSchedule] = useState(false);
  const [isSeats, setSeats] = useState(false);
  const [isBooking, setBooking] = useState(false);
  const [isTicket, setTicket] = useState(false);
  const [isNotifications, setNotifications] = useState(false);
  const [isMissing, setMissing] = useState(false);
  const [isCancelled, setCancelled] = useState(false);
  const [isForWeb, setForWeb] = useState(false);

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

  const openURL = async (url) => {
    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Open the URL in the default browser
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URL: ${url}`);
    }
  };

  const renderButton = (title, iconName, modalName, setModalVisible) => {
    const isPressed = pressedButton === modalName;
    return (
      <TouchableOpacity
        style={[
          styles.button,
          isPressed && styles.pressedButton, // Apply styles dynamically
        ]}
        onPress={() => setModalVisible(true)}
        onPressIn={() => setPressedButton(modalName)} // Set pressed state
        onPressOut={() => setPressedButton(null)} // Reset pressed state
      >
        <Text style={[styles.buttonText, isPressed && styles.pressedButtonText]}>
          {title}
        </Text>
        <Ionicons name={iconName} size={40} color={isPressed ? "#fff" : "#191970"} />
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>USER GUIDE </Text>
          <View style={styles.iconContainer}>
            <FontAwesome style={styles.iconstyle} name="code" size={50} color="#fff" />
          </View>
        </View>
        <View style={styles.bottomBorder3} />
        <Text style={styles.sectionTitle}>FAQs</Text>

        {/* Question Section */}
        <View style={styles.section}>
          {/* Button 1 */}
          {renderButton(" Where to find the Schedules ?", "chevron-forward", "schedule", setSchedule)}
          {/* Button 2 */}
          {renderButton(" How to look for Available Seats ?", "chevron-forward", "seats", setSeats)}
          {/* Button 3 */}
          {renderButton(" How to book a Trip ", "chevron-forward", "booking", setBooking)}
          {/* Button 4 */}
          {renderButton(" Where to find my Ticket ?", "chevron-forward", "ticket", setTicket)}
          {/* Button 5 */}
          {renderButton(" What are Notifications for ?", "chevron-forward", "notifications", setNotifications)}
          {/* Button 6 */}
          {renderButton(" Ticket not recieved (missing) ?", "chevron-forward", "missing", setMissing)}
          {/* Button 71 */}
          {renderButton(" Scheduled trip got canncelled ?", "chevron-forward", "cancelled", setCancelled)}
        </View>


        <TouchableOpacity style={styles.returnButton1} onPress={() => setForWeb(true)}>
          <Text style={styles.returnText}>Connect With Us</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.returnButton2} onPress={() => navigation.navigate('About')}>
          <Text style={styles.returnText1}>RETURN</Text>
        </TouchableOpacity>




        <Modal visible={isSchedule} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setSchedule(false)}>
              <Ionicons name="close-circle" size={70} color="#000080" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Where to find the</Text>
            <Text style={styles.modalTitle1}> Schedules:</Text>
            <View style={styles.bottomBorder1} />

            <ScrollView style={styles.scrollView}>

              {/* Instruction Text */}
              <Text style={styles.modalText}>
                You can see the available schedule in two ways:
              </Text>

              {/* Section 1 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>1</Text>
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 1.</Text>
                      <Text style={styles.sectionText}>You can view the schedules by clicking the schedules icon.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 2.</Text>
                      <Text style={styles.sectionText}>You can search for specific schedules by clicking the search icon to reveal the search box. Type the desired destination or departure date to filter the schedules.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 3.</Text>
                      <Text style={styles.sectionText}>Click the desired schedule to see more information, then click the "Book a Trip" button to make a reservation.</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Section 2 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>2</Text>
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 1.</Text>
                      <Text style={styles.sectionText}>You can click the "Book A Trip" in the dashboard or "Book" in the navigation bar below.</Text>
                    </View>

                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 2.</Text>
                      <Text style={styles.sectionText}>Enter the desired departure date and destination to see all available bus schedules.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 3.</Text>
                      <Text style={styles.sectionText}>Select by clicking one of them to book a trip.</Text>
                    </View>
                  </View>
                </View>
              </View>


              <TouchableOpacity style={styles.returnButton1} onPress={() => setSchedule(false)}>
                <Text style={styles.returnText}>CLOSE</Text>
              </TouchableOpacity>
              
            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal visible={isSeats} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setSeats(false)}>
              <Ionicons name="close-circle" size={70} color="#000080" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.modalTitle}>How to look for </Text>
              <Text style={styles.modalTitle1}>Available Seats :</Text>
              <View style={styles.bottomBorder1} />
            <ScrollView style={styles.scrollView}>
              {/* Instruction Text */}
              <Text style={styles.modalText}>You can see the available seats in two ways:</Text>

              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>1</Text>
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 1.</Text>
                      <Text style={styles.sectionText}>On Schedules you will see all the available schedules, you can search for a specific one.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 2.</Text>
                      <Text style={styles.sectionText}>Select the desire Trip Schedule. the selected schedule will expand to show more details about the trip.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 3.</Text>
                      <Text style={styles.sectionText}>The data will only show the number of occupied or reserved seats for that reservation. To see more, click “Book a Trip”.</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Section 2 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>2</Text>
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 1.</Text>
                      <Text style={styles.sectionText}>To see a more detailed view including seat arrangements, click “Book A Trip”.</Text>
                    </View>

                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 2.</Text>
                      <Text style={styles.sectionText}>Click the select seat to see all available seats including there arrangement.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 3.</Text>
                      <Text style={styles.sectionText}>You can now select the seat you want to book.</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.returnButton1} onPress={() => setSeats(false)}>
                <Text style={styles.returnText}>CLOSE</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={isBooking} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setBooking(false)}>
              <Ionicons name="close-circle" size={70} color="#000080" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.modalTitle}>Who to book a </Text>
              <Text style={styles.modalTitle1}>Bus trip :</Text>
              <View style={styles.bottomBorder1} />
            <ScrollView style={styles.scrollView}>
              {/* Instruction Text */}
              <Text style={styles.modalText}>You can Book your trip in two ways :</Text>

              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>1</Text>
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 1.</Text>
                      <Text style={styles.sectionText}>Click the Schedules icon on the navigation bar or in the dashboard.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 2.</Text>
                      <Text style={styles.sectionText}>Search and click the desire schedule, then click the “Book a Trip Button”.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 3.</Text>
                      <Text style={styles.sectionText}>Click the Select Seat button and confirm the desire seat to book.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 4.</Text>
                      <Text style={styles.sectionText}>Click the “Pay” button and continue with the payment process.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 5.</Text>
                      <Text style={styles.sectionText}>In the end of the process you will be shown a digital version of your Trip Ticket as well as some options.</Text>
                    </View>
                  </View>
                </View>
              </View>


              {/* Section 2 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>2</Text>
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 1.</Text>
                      <Text style={styles.sectionText}>To see a more detailed view including seat arrangements, click “Book A Trip”.</Text>
                    </View>

                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 2.</Text>
                      <Text style={styles.sectionText}>Click the select seat to see all available seats including there arrangement.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 3.</Text>
                      <Text style={styles.sectionText}>You can now select the seat you want to book.</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.returnButton1} onPress={() => setBooking(false)}>
                <Text style={styles.returnText}>CLOSE</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal visible={isTicket} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setTicket(false)}>
              <Ionicons name="close-circle" size={70} color="#000080" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.modalTitle}>Where to find your</Text>
              <Text style={styles.modalTitle1}>Ticket :</Text>
              <View style={styles.bottomBorder1} />
            <ScrollView style={styles.scrollView}>
              {/* Instruction Text */}
              <Text style={styles.modalText}>Here are the two ways you can find your digital Bus Trip Ticket :</Text>

              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>1</Text>
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText2}>You can view your trip ticket right after you finish the payment process.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText2}>You will have an option to download it as a pdf file or set a reminder on calendar.</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Section 2 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>2</Text>
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 1.</Text>
                      <Text style={styles.sectionText}>In the dashboard, you can directly see the list of trips you have booked, you can click one of them to reveal the digital QR code ticket.</Text>
                    </View>

                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 2.</Text>
                      <Text style={styles.sectionText}>On dashboard, you can also click the the “My Ticket” option on the navigation bar to reveal all the trips you booked.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 3.</Text>
                      <Text style={styles.sectionText}>You can click one of booked trips to reveal more details, there's also a button “View Ticket”, click it to reveal the QR code ticket.</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.returnButton1} onPress={() => setTicket(false)}>
                <Text style={styles.returnText}>CLOSE</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal visible={isNotifications} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setNotifications(false)}>
              <Ionicons name="close-circle" size={70} color="#000080" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.modalTitle}>What are </Text>
              <Text style={styles.modalTitle1}>Notifications for :</Text>
              <View style={styles.bottomBorder1} />
            <ScrollView style={styles.scrollView}>
              {/* Instruction Text */}
              <Text style={styles.modalText1}>The Notifications Represented by the Bell icon in the dashboard provides user updates about the bus services.</Text>
              <Text style={styles.modalText1}>It provides confirmations about your bookings, Update from travel promos and discounts. Changes about the mobile applications, Update about the service changes, and Update about trip cancelations and delays.</Text> 
              <Text style={styles.modalText1}>To access your notifications this is the following steps:</Text>

              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  {/*<Text style={styles.sectionNumber}>1</Text>*/}
                    {/* Placeholder Video */}
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 1.</Text>
                      <Text style={styles.sectionText}>First click the bell bell icon to show you the list of all the notifications yur accout has recieved.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 2.</Text>
                      <Text style={styles.sectionText}>Open one of them by clicking your selected notifications.</Text>
                    </View>
                    <View style={styles.container1}>
                      <Text style={styles.sectionText1}>STEP 3.</Text>
                      <Text style={styles.sectionText}>You can now read the content of your notification, you can also delete the notifications you have recieved.</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.returnButton1} onPress={() => setNotifications(false)}>
                <Text style={styles.returnText}>CLOSE</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal visible={isMissing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setMissing(false)}>
              <Ionicons name="close-circle" size={70} color="#000080" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.modalTitle}>Ticket not received </Text>
              <Text style={styles.modalTitle1}>(Missing) :</Text>
              <View style={styles.bottomBorder1} />
            <ScrollView style={styles.scrollView}>
              {/* Instruction Text */}
              <Text style={styles.modalText}>If you encounter this sort of issue, this are the things you can do:</Text>

              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber1}>Case 1 :</Text>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText2}>If you make a purchase and complete the payment process and did not redirect you to your Digital ticket view please contact our help desk to confirm if the payment process is successful and provide your ticket. </Text>
                    </View>

                    <TouchableOpacity onPress={() => openURL('mailto:HelpDesk@gmail.com')}>
                      <Text style={styles.link}>HelpDesk@gmail.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openURL('tel:+63912-345-6789')}>
                      <Text style={styles.link}>+63 912-345-6789 </Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>

              {/* Section 2 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber1}>Case 2 :</Text>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText2}>In case of missing booking record or accidental deletion of booking record. You can contact the help desk to confirm the booking record by providing the booking details. The process will provide you a PDF file of your Digital QR code ticket after confirmation.</Text>
                    </View>

                    <TouchableOpacity onPress={() => openURL('mailto:HelpDesk@gmail.com')}>
                      <Text style={styles.link}>HelpDesk@gmail.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openURL('tel:+63912-345-6789')}>
                      <Text style={styles.link}>+63 912-345-6789 </Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>

              {/* Section 3 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber1}>Case 3 :</Text>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText2}>If you are in the terminal you can ask the the The Help Desk office or Cashier directly. You must provide the booking details to confirm the reservation and provide you a printed version of your digital ticket.</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.returnButton1} onPress={() => setMissing(false)}>
                <Text style={styles.returnText}>CLOSE</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal visible={isCancelled} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setCancelled(false)}>
              <Ionicons name="close-circle" size={70} color="#000080" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.modalTitle}>Scheduled trip got</Text>
              <Text style={styles.modalTitle1}>Cancelled :</Text>
              <View style={styles.bottomBorder1} />
            <ScrollView style={styles.scrollView}>
              {/* Instruction Text */}
              <Text style={styles.modalText1}>Do you scheduled trip suddenly get cancelled ?? Here is what you can do :</Text>

              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>1</Text>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText2}>To confirm if your trip got cancelled, Check for a cancelation notification by clicking the bell icon in the dashboard. You can now find and open the cancelation notification. </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Section 2 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>2</Text>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText2}>After confirming your trip cancellation, immediately contact the Help desk section or use the provided contacts below or from the Cancellation notification. This is to start the refund or reschedule process.</Text>
                    </View>

                    <TouchableOpacity onPress={() => openURL('mailto:HelpDesk@gmail.com')}>
                      <Text style={styles.link}>HelpDesk@gmail.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openURL('tel:+63912-345-6789')}>
                      <Text style={styles.link}>+63 912-345-6789 </Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>

              {/* Section 3 */}
              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBody}>
                  <Text style={styles.sectionNumber}>3</Text>
                    {/* Instructions */}
                    <View style={styles.container1}>
                      <Text style={styles.sectionText2}>To confirm that you are one of the affected passengers of the cancelled trip, you will be asked to keep the record of your digital ticket for that specific schedule trip. This is needed as you will be asked for your ticket details as a form of a confirmation for the refund or reschedule process. </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionText1}> The Ceres.Co company is committed to providing safe, reliable, and comfortable bus services and will provide reasonable compensations for any inconvinence on the services. Inconvinence to the customers are not taken lightly by the company and willing to provide and compensate for it.</Text>
              <View style={styles.bottomBorder2} />


              <TouchableOpacity style={styles.returnButton1} onPress={() => setCancelled(false)}>
                <Text style={styles.returnText}>CLOSE</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal animationType="fade" transparent={true} visible={isForWeb} >
                        <View style={styles.modalContainer1}>
                          <View style={styles.modalContent1}>
                            
                              <TouchableOpacity style={styles.headerbox1}>
                                <Text style={styles.header1}>CONNECT WITH US</Text>
                              </TouchableOpacity>
                            <ScrollView>
                              <Text style={styles.text}>
                                To know more about the CERES.CO, visit our web site at:
                              </Text>
                              <Text style={styles.link2} onPress={() => Linking.openURL('https://www.CERESCO.com/Home')} > www.CERESCO.com/Home </Text>
              
                              <Text style={styles.text}>Do you found problems with the app?? Email it to our developers at: </Text>
                              <Text style={styles.link2} onPress={() => Linking.openURL('mailto:CERESDevs@gmail.com')} > CERESDevs@gmail.com</Text>
              
                              <Text style={styles.description}>Reporting bugs, errors or design problems to our developers helps us improve our app and make it more user-friendly and usable for you users. We also read your ratings and suggestions to our app. Leave a review to help us improve </Text>
              
                              <Text style={styles.text}>Have suggestions or concerns about the Bus Trips, Schedule, or anything in between? </Text>
                              <Text style={styles.link2} onPress={() => Linking.openURL('mailto:CeresTripsManagement@gmail.com')} > CeresTripsManagement@gmail.com </Text>
                        
                              <Text style={styles.contactNumber}>0998-866-9677</Text>
              
                              <Text style={styles.description}>Please contact us for any concerns about your bus trip reservation. We handle missing reservations, ticket mismatch, trip rescheduling and cancellation, private bus reservations, and more. </Text>
                          </ScrollView>
                          <TouchableOpacity style={styles.closeButton2} onPress={() => setForWeb(false)} >
                                <Text style={styles.closeButtonText}>Close</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                    </Modal>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    paddingTop: '10%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    flexDirection:"row",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: '3%',
  },
  headerTitle: {
    fontSize: 42,
    color: '#191970',
    fontWeight: '500',
    marginVertical:25
  },
  bottomBorder3: {
    height: 3, // Thickness of the border
    backgroundColor: '#191970', // Border color
    marginTop:0,
    marginBottom:15,
    marginHorizontal:10
  },
  bottomBorder1: {
    height: 3, // Thickness of the border
    backgroundColor: '#191970', // Border color
    marginTop:0,
    marginBottom:15,
  },
  bottomBorder2: {
    height: 3, // Thickness of the border
    backgroundColor: '#191970', // Border color
    marginTop:0,
    marginBottom:10,
  },
  iconContainer: {
    backgroundColor: '#191970',
    padding: 10,
    width: '25%',
    height: '100%',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconstyle:{
    marginTop:"20%"
  },
  logo: {
    width: 117, 
    height: 117,
    borderRadius: 90, 
    resizeMode: 'contain',
  },
  logo1: {
    width: 50, 
    height: 50,
    resizeMode: 'contain',
    alignSelf:"center",
  },
  
  section: {
    backgroundColor: '#191970',
    marginVertical: 5,
    paddingVertical: "7%",
    paddingHorizontal:10,
    //borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 40,
    color: '#191970',
    marginBottom: 20,
    fontWeight: '500',
    letterSpacing:3.5,
    textDecorationLine:"underline",
    marginLeft:15
  },
  link: {
    color: "#4682B4",
    fontSize: 16,
    marginVertical: 5,
    textDecorationLine: "underline",
    alignSelf:"center",
  },



  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#fff', // Default background color
    borderWidth: 2,
    borderColor: '#fff', // Default border color
    borderRadius: 15,
    marginVertical: 10,
  },
  pressedButton: {
    backgroundColor: '#6eacda', // Light blue color for pressed state
    opacity:1,
    borderColor: '#fff', // Black border for pressed state
  },
  buttonText: {
    color: '#191970', // Default text color (blue)
    fontSize: 18,
    fontWeight:"400"
  },
  pressedButtonText: {
    color: '#fff', // White text color for pressed state
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "95%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal:10,
    position: "relative",
    borderWidth:2,
    borderColor:"#191970",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 10,
    zIndex: 1,
  },
  scrollView: { flex: 1 },

  modalTitle: {
    fontSize: 26,
    fontWeight: "500",
    color: "#000080",
  },
  modalTitle1: {
    fontSize: 26,
    fontWeight: "500",
    color: "#000080",
    marginBottom: 10,
  },
  modalText: { fontSize: 14, marginBottom: 20, color: "#333", marginHorizontal:5 },
  modalText1: { fontSize: 14, marginBottom: 20, color: "#333", marginHorizontal:5, textAlign:"justify" },

  section1: { marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "flex-start" },
  sectionNumber: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: "#191970",
    color: "#fff",
    textAlign: "center",
    lineHeight: 25,
    marginRight: 10,
    marginLeft:7,
    marginBottom:10,

  },
  sectionNumber1: {
    width: 70,
    height: 25,
    borderRadius: 10,
    backgroundColor: "#191970",
    color: "#fff",
    textAlign: "center",
    lineHeight: 25,
    marginRight: 10,
    marginLeft:7,
    marginBottom:10,
    marginTop:15

  },
  sectionBody: { flex: 1 },
  videoPlaceholder: {
    width: "70%",
    height: 120,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    alignSelf:"center",
    borderRadius:10,
  },
  sectionText2: { fontSize: 14, color: "#333", marginBottom: 15, marginHorizontal:10, alignContent:"center", fontWeight:"400", textAlign:"justify",lineHeight:20 },
  sectionText: { fontSize: 14, color: "#333", marginBottom: 15, marginLeft:5, width:"77%" },
  sectionText1: { fontSize: 14, color: "#191970", marginTop:1, marginBottom: 20, marginLeft:10, fontWeight:"bold", textAlign:"center"},
  returnButton1:{
    width: "40%",
    backgroundColor: "#191970",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf:"center",
    borderRadius:10,
    paddingVertical:10,
  },
  returnButton2:{
    width: "50%",
    backgroundColor: "#6eacda",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf:"center",
    borderRadius:10,
    paddingVertical:10,
    //marginTop:30
  },
  returnButton1:{
    width: "50%",
    backgroundColor: "#191970",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf:"center",
    borderRadius:10,
    paddingVertical:10,
    marginTop:25
  },
  returnText:{
    fontSize:16,
    color:"#fff",
    fontWeight:"500",
    letterSpacing:2,
  },
  returnText1:{
    fontSize:20,
    color:"#191970",
    fontWeight:"700",
    letterSpacing:2.5,
  },


  modalContainer1: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent1: {
    backgroundColor: '#03346e',
    width: '95%',
    height:"90%",
    borderRadius:20,
    alignItems: 'center',
    borderWidth:2,
    borderColor:"#6eacda"
  },
  headerbox:{
    width:"100%",
    paddingVertical:15,
    alignItems:'center',
    borderBottomWidth: 2,
    borderColor:"#6eacda",
    marginBottom:20
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
    textAlign:"justify",
    marginHorizontal: 10,
  },
  description: {
    fontSize: 12,
    color: 'white',
    textAlign: 'justify',
    marginVertical: 10,
    lineHeight: 18,
    marginHorizontal:15,
  },
  link2: {
    fontSize: 14,
    color: '#7fb7ff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  header1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fffdd0',
    alignSelf:"center",
    textAlign:"center"
  },
  headerbox1:{
    width:"100%",
    paddingVertical:15,
    alignItems:'center',
    borderBottomWidth: 2,
    borderColor:"#6eacda",
    marginBottom:20
  },
  contactNumber: {
    fontSize: 16,
    color: '#7fb7ff',
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton2: {
    backgroundColor: '#fffdd0',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 15,
    marginHorizontal:20,
    paddingHorizontal:"30%"
  },
  closeButtonText: {
    color: '#03346e',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Guide;
