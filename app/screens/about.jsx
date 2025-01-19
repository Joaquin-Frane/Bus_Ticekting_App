
import {  ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking, SafeAreaView, Modal,  Image, Animated, BackHandler} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function AboutUs() {
  const navigation = useNavigation();
  const [isForWeb, setForWeb] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null); // Move here

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


  // Functions to open and close modals
  const openGuideModal = () => setGuideModalVisible(true);
  const closeGuideModal = () => setGuideModalVisible(false);

  const openHelpModal = () => setHelpModalVisible(true);
  const closeHelpModal = () => setHelpModalVisible(false);

  const openWeb =() => setForWeb(true);
  const closeWeb =() => setForWeb(false)

  const openDev =() => setForDev(true);
  const closeDev =() => setForDev(false);



  // Expandable card handler
  const handleExpand = (index) => {
    
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  const ExpandableCard = ({ children, description, isExpanded, onPress }) => {
    return (
      <TouchableOpacity style={styles.offer} onPress={onPress}>
        {children}
        {isExpanded && 
          <View style={{paddingTop:5, borderTopWidth:2, marginTop:10, borderColor:"#4682B4", marginHorizontal:5 }}>
            <Text style={styles.cardDescription}>{description}</Text>
          </View>}
      </TouchableOpacity>
    );
  };
  

  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sticky Header */}
      <View style={{
        position: "absolute",
        top: "0%",      // Adjust as needed to fit within the safe area
        left: "0%",
        right: "0%",
        alignItems: "flex-start",
        zIndex: 1,      // Ensures it stays above other content
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        paddingTop:"10%",
        paddingBottom:"2%",
        }}>
    <TouchableOpacity 
        style={{
            width: "35%",
            padding: 3,
            backgroundColor: "#fff", // Semi-transparent background
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            borderRadius: 15,
            marginLeft:19,
            borderWidth:2,
            borderColor:"#191970"
        }}
        onPress={() => navigation.navigate("dash")}
    >
        <FontAwesome name="caret-left" size={22} color="#03346e" />
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#03346e", marginHorizontal: 10, marginVertical: 5,  }}>
            RETURN
        </Text>
    </TouchableOpacity>
</View>
    
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>

      <View style={styles.stickyHeader}>
        
      <Image style={{width:"90%", height:85,marginBottom:10}}
          source={require('../assets/image/full_logo_TP_dblue.png')} 
        />
      </View>

        {/* About Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT US</Text>
        </View>

        {/* Grouped Info and Buttons Section */}
        <View style={styles.groupContainer}>
          {/* Left Side: Text Group */}
          <View style={styles.textGroup}>
            <Text style={styles.infoText}>
              Travel with <Text style={styles.highlight1}>  Comfort</Text>
            </Text>
            <Text style={styles.infoText}>Travel with  <Text style={styles.highlight}>  Ease</Text></Text>
            <Text style={styles.infoText}>
              Travel with <Text style={styles.highlight2}>CERES.</Text>
            </Text>
          </View>

          {/* Right Side: Buttons Group */}
          <View style={styles.buttonsGroup}>
            <Button text="USER GUIDES" icon="info-circle" onPress={() => navigation.navigate('Guide')}/>
            <Button text="THE COMPANY" icon="question-circle" onPress={() => navigation.navigate('TheCompany')}/>
            <Button text="CONTACT US" icon="phone" onPress={openWeb}/>
            <Button text="THE DEVS" icon="code" onPress={() => navigation.navigate('Devs')}/>
          </View>
        </View>

        {/* Text Section with Background Box */}
        <View style={styles.textSection}>
          <View style={styles.textBox}>
            <Text style={styles.mainText}>
              We strive to provide you the <Text style={styles.highlight3}>BEST</Text> Experience on the
              <Text style={styles.highlight4}> Journey </Text>
              to your
              <Text style={styles.highlight5}> Destination.</Text>
            </Text>
            
          </View>
        </View>

        <View style={styles.textSection2}>
          <View >
            <Text style={styles.mainText2}>
              And here is what we can <Text style={styles.highlight6}>OFFER</Text> ...
            </Text>
          </View>
        </View>


    {/* Offer Section */}
    <View style={styles.offerSection}>
      <ExpandableCard description="We are committed to providing safe, reliable, and comfortable bus services across Philippines. Whether you're commuting to work, traveling for leisure, or visiting family, we ensure that every ride with us is stress-free and enjoyable. Our modern fleet and professional drivers guarantee an exceptional travel experience."
        isExpanded={expandedCardIndex === 0}
        onPress={() => handleExpand(0)}>
          <Text style={styles.offerText}>Reliability with <Text style={styles.subtext1}>COMFORT</Text></Text>
      </ExpandableCard>

      <ExpandableCard description="Ceres.Co offers affordable, efficient, and hassle-free transportation options for travelers of all kinds. With easy online booking, flexible schedules, and extensive routes, we connect you to your destination without the worry. Travel smarter with us."
        isExpanded={expandedCardIndex === 1}
        onPress={() => handleExpand(1)}>
          <Text style={styles.offerText}>Convenience at a <Text style={styles.subtext1}>CHEAP</Text> cost</Text>
      </ExpandableCard>

      <ExpandableCard description="Safety is at the heart of everything we do at Ceres.Co. Our buses are equipped with the latest technology, and our drivers are trained professionals with a passion for providing smooth and secure journeys. We take pride in keeping you and your loved ones safe, no matter where you're headed."
        isExpanded={expandedCardIndex === 2}
        onPress={() => handleExpand(2)}>
          <Text style={styles.offerText}>Your safety is the <Text style={styles.subtext1}>PRIORITY</Text></Text>
      </ExpandableCard>

      <ExpandableCard description="We believe in responsible travel. That's why Ceres.Co prioritizes eco-friendly transportation solutions, minimizing our environmental footprint while delivering first-class service. Enjoy sustainable travel at affordable rates with our green fleet of buses."
        isExpanded={expandedCardIndex === 3}
        onPress={() => handleExpand(3)}>
          <Text style={styles.offerText}>To <Text style={styles.subtext1}>MOVE</Text> with Sustainability</Text>
      </ExpandableCard>

      <ExpandableCard description="Ceres.Co isn't just about getting you from point A to point B it's about the experience in between. From premium seating to onboard entertainment and Wi-Fi, we make sure your journey is as pleasant and productive as possible. Discover the difference with us."
        isExpanded={expandedCardIndex === 4}
        onPress={() => handleExpand(4)}>
          <Text style={styles.offerText}>It's <Text style={styles.subtext1}>NOT</Text> just a ride but an <Text style={styles.subtext1}>EXP</Text>.</Text>
      </ExpandableCard>
    </View>

        {/* Website Button */}
        <View
          style={styles.websiteButton} >
          <Text style={styles.websiteText}>Visit our <Text style={styles.subtext4}>Website</Text> to Know more...</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://yourwebsite.com')}>
            <Text style={styles.subtext3}>Click me!!!</Text>
          </TouchableOpacity>
        </View>

        <Modal animationType="fade" transparent={true} visible={isForWeb} >
          <View style={styles.modalContainer1}>
            <View style={styles.modalContent1}>
              
                <TouchableOpacity style={styles.headerbox}>
                  <Text style={styles.header}>CONNECT WITH US</Text>
                </TouchableOpacity>
              <ScrollView>
                <Text style={styles.text}>
                  To know more about the CERES.CO, visit our web site at:
                </Text>
                <Text style={styles.link} onPress={() => Linking.openURL('https://www.CERESCO.com/Home')} > www.CERESCO.com/Home </Text>

                <Text style={styles.text}>Do you found problems with the app?? Email it to our developers at: </Text>
                <Text style={styles.link} onPress={() => Linking.openURL('mailto:CERESDevs@gmail.com')} > CERESDevs@gmail.com</Text>

                <Text style={styles.description}>Reporting bugs, errors or design problems to our developers helps us improve our app and make it more user-friendly and usable for you users. We also read your ratings and suggestions to our app. Leave a review to help us improve </Text>

                <Text style={styles.text}>Have suggestions or concerns about the Bus Trips, Schedule, or anything in between? </Text>
                <Text style={styles.link} onPress={() => Linking.openURL('mailto:CeresTripsManagement@gmail.com')} > CeresTripsManagement@gmail.com </Text>
          
                <Text style={styles.contactNumber}>0998-866-9677</Text>

                <Text style={styles.description}>Please contact us for any concerns about your bus trip reservation. We handle missing reservations, ticket mismatch, trip rescheduling and cancellation, private bus reservations, and more. </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeWeb} >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </ScrollView>
    </SafeAreaView>
  );
}
//button short cut creation
function Button({ text, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <FontAwesome name={icon} size={24} color="#fff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#03346e',
    justifyContent:"flex-start"
  },
  scrollView: {
    marginTop: 0, // To avoid overlap with sticky header
    backgroundColor: '#03346e'
  },
  stickyHeader: {
    alignSelf:"center",
    width: '107%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderBottomRightRadius:50,
    borderBottomLeftRadius:50,
    paddingTop:90
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#37496F',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  container: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  section: {
    backgroundColor: '#fffdd0',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 30,
    marginBottom:50,
    marginTop:50,
    marginHorizontal: 20,
  },
  sectionTitle: {
    color: '#03346e',
    fontSize: 40,
    fontWeight: '900',
    textShadowColor: '#fff',        // Shadow color
    textShadowOffset: { width: 2, height: 1 }, // Shadow offset
    textShadowRadius: 2,
  },
  groupContainer: {
    flexDirection: 'row',
    backgroundColor: '#021526',
    paddingVertical:20,
    marginBottom: 70,
    alignItems: 'flex-start',
  },
  textGroup: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 24,
    color: '#fffdd0',
    paddingVertical:3,
    fontWeight:"400",
  },
  highlight: {
    fontSize: 30,
    fontWeight: '700',
    color: '#6eacda',
    fontStyle:"italic",
    letterSpacing:3
  },
  highlight1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6eacda',
    fontStyle:"italic",
    fontFamily:"sans-serif-medium",
    letterSpacing:3
  },
  highlight2: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6eacda',
    fontStyle:"italic",
    letterSpacing:3
  },
  highlight3: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#03346e',
    textDecorationLine: " underline",
  },
  highlight4: {
    fontSize: 40,
    color: '#6eacda',
    fontStyle:"italic",
    fontWeight:"bold",
    textShadowColor: '#03346e',        // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 2,
  },
  highlight5: {
    fontSize: 40,
    color: '#03346e',
    letterSpacing: 9,
    fontWeight:"400",
    textShadowColor: '#fffdd0',        // Shadow color
    textShadowOffset: { width: 2, height: 1 }, // Shadow offset
    textShadowRadius: 2,
  },
  highlight6: {
    fontSize: 40,
    fontWeight: '700',
    color: '#6eacda',
    fontStyle:"italic",
    letterSpacing:3,
    
  },
  buttonsGroup: {
    flex:1,
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4682B4',
    padding: 12,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    marginBottom: 15,
    marginRight: -2,
    borderWidth:2,
    borderColor:"#fff"
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  textSection: {
    marginBottom: 40,
  },
  textSection2: {
    marginBottom: 30,
    marginTop: 40,
  },
  textBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White background with 90% opacity
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  mainText: {
    fontSize: 34,
    color: '#021526',
    textAlign: 'left',
    fontWeight:"300"
  },
  mainText2: {
    fontSize: 34,
    color: '#fffdd0',
    textAlign: 'center',
    fontWeight:"300",
    marginHorizontal:5,
    marginBottom:20
  },
  offerSection: {
    marginBottom: 40,
  },
  offer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6eacda',
    borderRadius: 30,
    paddingVertical: 15,
    marginBottom: 30,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  offerText: {
    fontSize: 20,
    color: '#03346e',
  },
  subtext1: {
    fontSize: 20,
    color: '#4682B4',
    fontWeight:"900",
    letterSpacing:1
  },
  subtext3: {
    fontSize: 26,
    color: '#4682B4',
    fontWeight:"900",
    letterSpacing:1,
  },
  subtext4: {
    fontSize: 30,
    color: '#4682B4',
    fontWeight:"900",
    letterSpacing:1,
    
  },
  websiteButton: {
    alignItems: 'left',
    justifyContent:"center",
    backgroundColor: '#fffdd0',
    borderTopRightRadius: 200,
    height: 210,
    width:"55%",
    paddingHorizontal:10
  },
  websiteText: {
    color: '#03346e',
    fontSize: 25,
    marginTop: 20
  },
  websiteLink: {
    color: '#FFFFFF',
    fontSize: 20,
    textDecorationLine: 'underline',
    marginTop: 10,
    marginLeft: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitIcon:{
    alignSelf:"flex-end",
    paddingVertical:15,
    paddingRight:30,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '95%',
    height:"90%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03346e',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#37496F',
    textAlign: 'center',
    marginBottom: 20,
    textAlign:"justify",
    marginHorizontal:10,
    paddingLeft:5,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf:"center",
  },
  modalCloseButton: {
    backgroundColor: '#1F4D7B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft:10,
  },
  modalTopBAr:{
    width:"100%",
    backgroundColor:"#fff",
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    borderBottomWidth:2,
    borderColor:"#191970",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:10,
  },
  headerbox:{
    width:"100%",
    paddingVertical:15,
    alignItems:'center',
    borderBottomWidth: 2,
    borderColor:"#6eacda",
    marginBottom:20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fffdd0',
    alignSelf:"center",
    textAlign:"center"
  },
  header1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    alignSelf:"center",
    textAlign:"center",
    marginBottom:20,
    marginHorizontal:7,
  },
  header2: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign:"justify",
    marginHorizontal: 10,
    marginTop:15
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
    textAlign:"justify",
    marginHorizontal: 10
    ,
  },
  link: {
    fontSize: 14,
    color: '#7fb7ff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: 'white',
    textAlign: 'justify',
    marginVertical: 10,
    lineHeight: 18,
    marginHorizontal:15,
  },
  contactNumber: {
    fontSize: 16,
    color: '#7fb7ff',
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton: {
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
  cardDescription: {
    fontSize: 16,
    fontWeight:"400",
    color: '#03346e',
    marginTop: 10,
    lineHeight: 18,
    marginHorizontal:10,
    textAlign:"justify",
    lineHeight: 24,
    paddingBottom:10
  },
});