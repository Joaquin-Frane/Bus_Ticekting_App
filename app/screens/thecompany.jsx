import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView, SafeAreaView, Modal, Image, ImageBackground, Linking, BackHandler } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TheAbout = () => {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCubao, setShowCubao] = useState(false);
  const [showBatangas, setShowBatangas] = useState(false);
  const [showPasay, setShowPasay] = useState(false);
  const [showSagay, setShowSagay] = useState(false);
  const [showKalibo, setShowKalibo] = useState(false);
  const [showCebu, setShowCebu] = useState(false);

  const [showbus1, setShowBus1] = useState(false);
  const [showbus2, setShowBus2] = useState(false);
  const [showbus3, setShowBus3] = useState(false);

  const navigation = useNavigation();

  const handleExpand = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  const ExpandableCard = ({ children, description, isExpanded, onPress }) => {
    const animatedHeight = useRef(new Animated.Value(0)).current; // Animation reference
    const contentHeight = useRef(0); // Store the actual height of the content
    const contentRef = useRef(null); // Reference for measuring the content
  
    React.useEffect(() => {
      if (isExpanded) {
        // Measure the content's height
        contentRef.current.measure((x, y, width, height) => {
          contentHeight.current = height; // Store the height
          Animated.timing(animatedHeight, {
            toValue: height,
            duration: 200, // Animation duration
            easing: Easing.ease, // Smooth animation
            useNativeDriver: false, // Native driver doesn't support height animation
          }).start();
        });
      } else {
        // Collapse to zero height
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: false,
        }).start();
      }
    }, [isExpanded]);
  
    return (
      <TouchableOpacity style={styles.offer} onPress={onPress}>
        {children}
        <Animated.View style={[styles.expandedContent, { height: animatedHeight }]}>
          {/* This hidden view is used for measuring content height */}
          <View ref={contentRef} onLayout={(event) => { contentHeight.current = event.nativeEvent.layout.height; }} style={{ position: 'absolute', opacity: 0, zIndex: -1 }} >
            <View style={{ paddingTop: 5, borderTopWidth: 2, marginTop: 10, borderColor: "#4682B4", marginHorizontal: 5 }}>
              <Text style={styles.cardDescription}>{description}</Text>
            </View>
          </View>
          {/* This is the actual visible content */}
          <View style={{ paddingTop: 5, borderTopWidth: 2, marginTop: 10, borderColor: "#4682B4", marginHorizontal: 5 }}>
            <Text style={styles.cardDescription}>{description}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  const titles = ["Provincial Bus Travel", "Bus Rental", "PITX Integration",];

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

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CERES.Corp</Text>
          <View style={styles.iconContainer}>
            <Ionicons style={styles.iconstyle} name="bus" size={60} color="#fff" />
          </View>
        </View>

        
        <View style={styles.tabContainer}>
          <Text style={styles.tab}>Services</Text>
          <Text style={styles.tab}>Bus Units</Text>
          <Text style={styles.tab}>Terminals</Text>
        </View>

        <View style={styles.content}>
        <ImageBackground   source={require("../assets/icons/sagay-bacolod-bg.jpg")} style={styles.background1}>
          <Text style={styles.title}>Ceres Liners</Text>
          <View style={styles.imagePlaceholder1}>
            <Image source={require("../assets/icons/sagay-bacolod.jpg")} style={styles.logo1} />
          </View>
          <Text style={styles.description}>
            Experience fast and reliable point-to-point travel with Ceres Bus Liners. Skip the detours and enjoy a smooth, comfortable ride that takes you directly to your destination. Our modern fleet,
            punctual service, and commitment to convenience ensure you get where you need to be quickly and hassle-free. With Ceres, your journey is always on the express route to satisfaction.
          </Text>
          </ImageBackground>


          <View style={styles.separator4} />
          <Text style={styles.subTitle}>SERVICES</Text>
          <View style={styles.offerSection}>
            <ExpandableCard
              description="Explore the beauty of Luzon with our safe, reliable, and affordable provincial bus travel services! Whether you're visiting scenic mountain landscapes, coastal getaways, or bustling city centers, our buses are here to take you there."
              isExpanded={expandedCardIndex === 0}onPress={() => handleExpand(0)}>
              <Text style={styles.offerText}>Provincial Bus Travel</Text>
            </ExpandableCard>

            <ExpandableCard
              description="Our affiliate partner provides bus rental services for company outings, family occasions, or any other transportation needs for big groups. To receive a quote from a charter operator, please fill out the form provided and you will be contacted within 12 hours."
              isExpanded={expandedCardIndex === 1} onPress={() => handleExpand(1)}>
              <Text style={styles.offerText}>Bus Rental</Text>
            </ExpandableCard>

            <ExpandableCard
              description="The (PITX) Parañaque Integrated Terminal Exchange serves as a hub for buses, jeepneys, and other public utility vehicles headed for areas north of Metro Manila and areas south of Metro Manila, including Cavite and Batangas."
              isExpanded={expandedCardIndex === 2} onPress={() => handleExpand(2)}>
              <Text style={styles.offerText}>PITX Integration</Text>
            </ExpandableCard>
          </View>
        

          <View style={styles.separator} />
          <Text style={styles.subTitle}>BUS UNITS</Text>
          <View style={styles.busUnits}>
            {/* Regular Provincial Bus */}
            <View style={styles.busCard}>
              <View style={styles.busImagePlaceholder}>
                <Image source={require('../assets/icons/BUS7.png' )} style={styles.logo2} />
              </View>
                <Text style={styles.busTitle}>Regular Provincial Bus</Text>
                <View style={styles.separator2} />
                <Text style={styles.busDetails}>Seat Config: 2×2 seater</Text>
                <Text style={styles.busDetails}>Seat Cap: 29 passengers</Text>
                <Text style={styles.busDetails}>Air-conditioned</Text>
                <TouchableOpacity style={styles.seatLayoutButton} onPress={() => setShowBus1(true)}>
                  <Text style={styles.seatLayoutButtonText}>SEAT LAYOUT</Text>
                </TouchableOpacity>
              </View>

            {/* KingLong Provincial Bus */}
            <View style={styles.busCard}>
              <View style={styles.busImagePlaceholder}>
                <Image source={require('../assets/icons/BUS5.png' )} style={styles.logo2} />
              </View>
                <Text style={styles.busTitle}>KingLong Provincial Bus</Text>
                <View style={styles.separator2} />
                <Text style={styles.busDetails}>Seat Config: 2×2 seater</Text>
                <Text style={styles.busDetails}>Seat Cap: 50 passengers</Text>
                <Text style={styles.busDetails}>Air-conditioned</Text>
                <TouchableOpacity style={styles.seatLayoutButton} onPress={() => setShowBus2(true)}>
                  <Text style={styles.seatLayoutButtonText}>SEAT LAYOUT</Text>
                </TouchableOpacity>
              </View>

            {/* Mini Provincial Bus */}
            <View style={styles.busCard}>
              <View style={styles.busImagePlaceholder}>
                <Image source={require('../assets/icons/BUS4.png' )} style={styles.logo2} />
              </View>
                <Text style={styles.busTitle}>Mini Provincial   Bus</Text>
                <View style={styles.separator2} />
                <Text style={styles.busDetails}>Seat Config: 1×2 seater</Text>
                <Text style={styles.busDetails}>Seat Cap: 20 passengers</Text>
                <Text style={styles.busDetails}>Air-conditioned</Text>
                <TouchableOpacity style={styles.seatLayoutButton} onPress={() => setShowBus3(true)}>
                  <Text style={styles.seatLayoutButtonText}>SEAT LAYOUT</Text>
                </TouchableOpacity>
              </View>
            </View>


          <View style={styles.separator3} />
          <ImageBackground   source={require("../assets/icons/14.jpg")} style={styles.background2}>
          <Text style={styles.subTitle}>TERMINALS</Text>
          <View style={styles.busUnits}>
            <View style={styles.terminalContainer}>
              <TouchableOpacity style={styles.terminalButton} onPress={() => setShowCubao(true)}>
                <Text style={styles.terminalButtonText}>CUBAO</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.terminalButton} onPress={() => setShowBatangas(true)}>
                <Text style={styles.terminalButtonText}>BATANGAS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.terminalButton} onPress={() => setShowPasay(true)}>
                <Text style={styles.terminalButtonText}>PASAY</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.terminalButton} onPress={() => setShowSagay(true)}>
                <Text style={styles.terminalButtonText}>SAGAY</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.terminalButton} onPress={() => setShowKalibo(true)}>
                <Text style={styles.terminalButtonText}>KALIBO</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.terminalButton} onPress={() => setShowCebu(true)}>
                <Text style={styles.terminalButtonText}>CEBU</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.separator5} />
          <TouchableOpacity style={styles.returnButton} onPress={() => navigation.navigate('About')}>
            <Text style={styles.returnButtonText}>RETURN</Text>
          </TouchableOpacity>
          </ImageBackground>
        </View>

          <Modal  animationType="slide" transparent={true} visible={showCubao} onRequestClose={() => setShowCubao(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer}>
                <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowCubao(false)}>
                  <Ionicons name="close" size={35} color="#fff" style={styles.dot5} />
                </TouchableOpacity>

                {/* Placeholder for Image */}
                <View style={styles.imagePlaceholder}>
                  <Image source={require('../assets/icons/Cubao1.jpg' )} style={styles.logo3} />
                </View>

                {/* Content */}
                <Text style={styles.modalTitle}>CUBAO</Text>
                <Text style={styles.modalDescription}> 
                Cubao is the commercial heart of Quezon City, at the intersection of EDSA and Aurora Boulevard.
                </Text>

                <Text style={styles.modalDescription}>
                  Metro Manila, the National Capital Region, includes Manila and its surrounding cities and municipalities. 
                  Traveling within the region takes 30 minutes to 2 hours, depending on traffic conditions. 
                  Manila is the political, economic, and cultural center of the Philippines, offering a vibrant mix of urban life, dining, shopping, and entertainment options.
                </Text>

                <View style={{flexDirection:"row", Width:"50%"}}>

                  <Text style={styles.boldText}>Address:</Text>
                  <Text style={styles.modalDetails}>New York Ave, Quezon City, Metro Manila</Text>
                </View>
                  
                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Contact Number:</Text>
                  <TouchableOpacity onPress={() => openLink('tel:+63 0910 738 5318')} >
                    <Text style={styles.modalDetails1}>+63 0910 738 5318</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={() => openLink('https://maps.app.goo.gl/DKFCj4jJcJWqqeBa7')} >
                  <Text style={styles.googleMapsLink}>Google maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal  animationType="slide" transparent={true} visible={showBatangas} onRequestClose={() => setShowBatangas(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer}>
                <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowBatangas(false)}>
                  <Ionicons name="close" size={35} color="#fff" style={styles.dot5} />
                </TouchableOpacity>

                {/* Placeholder for Image */}
                <View style={styles.imagePlaceholder}>
                  <Image source={require('../assets/icons/batangas.jpg' )} style={styles.logo3} />
                </View>

                {/* Content */}
                <Text style={styles.modalTitle}>BATANGAS</Text>
                <Text style={styles.modalDescription}> 
                  Batangas is a province in the southern part of Luzon, the main island of the northern Philippines.
                </Text>

                <Text style={styles.modalDescription}>
                Manila to Batangas is a well-traveled route, with a distance of about 110 to 120 kilometers, depending on the destination in Batangas. 
                The travel time by car or bus usually takes 2 to 3 hours, depending on traffic conditions. Batangas is known for its beaches, dive spots, and scenic views, making it a popular getaway from Manila.
                </Text>

                <View style={{flexDirection:"row", Width:"50%"}}>

                  <Text style={styles.boldText}>Address:</Text>
                  <Text style={styles.modalDetails}>4200 Provincial Highway, Bolbok, Batangas</Text>
                </View>
                  
                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Contact Number:</Text>
                  <TouchableOpacity onPress={() => openLink('tel:+63 (033) 321 3591')} >
                    <Text style={styles.modalDetails1}>+63 (033) 321 3591</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => openLink('https://maps.app.goo.gl/rB3ZuHGtZdRuds1K7')} >
                  <Text style={styles.googleMapsLink}>Google maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal  animationType="slide" transparent={true} visible={showPasay} onRequestClose={() => setShowPasay(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer}>
                <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowPasay(false)}>
                  <Ionicons name="close" size={35} color="#fff" style={styles.dot5} />
                </TouchableOpacity>

                {/* Placeholder for Image */}
                <View style={styles.imagePlaceholder}>
                  <Image source={require('../assets/icons/pasay.jpg' )} style={styles.logo3} />
                </View>

                {/* Content */}
                <Text style={styles.modalTitle}>PASAY</Text>
                <Text style={styles.modalDescription}> 
                Pasay, located south of Manila, is home to the Ninoy Aquino International Airport and the Bay City development, which houses the SM Mall of Asia.
                </Text>

                <Text style={styles.modalDescription}>  
                  Traveling within the region takes 30 minutes to 2 hours, depending on traffic conditions. 
                </Text>

                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Address:</Text>
                  <Text style={styles.modalDetails}>Buendia Ave, Pasay, Metro Manila</Text>
                </View>
                  
                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Contact Number:</Text>
                  <TouchableOpacity onPress={() => openLink('tel:+63 943 664 9310')} >
                    <Text style={styles.modalDetails1}>+63 943 664 9310</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={() => openLink('https://maps.app.goo.gl/FMfUs5jW14F32eHL8')} >
                  <Text style={styles.googleMapsLink}>Google maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal  animationType="slide" transparent={true} visible={showSagay} onRequestClose={() => setShowSagay(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer}>
                <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowSagay(false)}>
                  <Ionicons name="close" size={35} color="#fff" style={styles.dot5} />
                </TouchableOpacity>

                {/* Placeholder for Image */}
                <View style={styles.imagePlaceholder}>
                  <Image source={require('../assets/icons/sagay.jpg' )} style={styles.logo3} />
                </View>

                {/* Content */}
                <Text style={styles.modalTitle}>SAGAY</Text>
                <Text style={styles.modalDescription}> 
                  Sagay City, founded in 1860 by Teniente Francisco Rodriguez and Basilio Cordova, was initially called Arguelles. 
                  In 1867, it was transferred to Pueblo de Magallanes, now Old Sagay.
                </Text>

                <Text style={styles.modalDescription}>  
                  Traveling within the region takes 30 minutes to 2 hours, depending on traffic conditions. 
                </Text>

                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Address:</Text>
                  <Text style={styles.modalDetails}>Provincial Highway, Poblacion II (Brgy. 2), 6122 Sagay City, Negros Occidental</Text>
                </View>
                  
                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Contact Number:</Text>
                  <TouchableOpacity onPress={() => openLink('tel:+63 033 321 3591')} >
                    <Text style={styles.modalDetails1}>+63 (033) 321 3591</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={() => openLink('https://maps.app.goo.gl/ynBNwH2ZkXY9gqpy8')} >
                  <Text style={styles.googleMapsLink}>Google maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal  animationType="slide" transparent={true} visible={showKalibo} onRequestClose={() => setShowKalibo(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer}>
                <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowKalibo(false)}>
                  <Ionicons name="close" size={35} color="#fff" style={styles.dot5} />
                </TouchableOpacity>

                {/* Placeholder for Image */}
                <View style={styles.imagePlaceholder}>
                  <Image source={require('../assets/icons/kalibo (1).jpg' )} style={styles.logo3} />
                </View>

                {/* Content */}
                <Text style={styles.modalTitle}>KALIBO</Text>
                <Text style={styles.modalDescription}> 
                  Kalibo is the capital of the province of Aklan, Philippines. It is a large town, with an airport that serves as the main gateway for Boracay, and a rich culture.
                </Text>

                <Text style={styles.modalDescription}>  
                  Traveling within the region takes 4 hours  to 7 hours, depending on traffic conditions.
                </Text>

                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Address:</Text>
                  <Text style={styles.modalDetails}>281 Osmeña Avenue, Kalibo, 5600 Aklan</Text>
                </View>

                <TouchableOpacity onPress={() => openLink('https://maps.app.goo.gl/n2PbbCXjoWAPD7AJA')} >
                  <Text style={styles.googleMapsLink}>Google maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal  animationType="slide" transparent={true} visible={showCebu} onRequestClose={() => setShowCebu(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer}>
                <TouchableOpacity style={styles.closeButtonModal} onPress={() => setShowCebu(false)}>
                  <Ionicons name="close" size={35} color="#fff" style={styles.dot5} />
                </TouchableOpacity>

                {/* Placeholder for Image */}
                <View style={styles.imagePlaceholder}>
                  <Image source={require('../assets/icons/cebu.jpg' )} style={styles.logo3} />
                </View>

                {/* Content */}
                <Text style={styles.modalTitle}>CEBU</Text>
                <Text style={styles.modalDescription}> 
                  Cebu City is the main city on Cebu Island in the Philippines and is known as the Queen City of the South. It is the capital of Cebu
                  Province, a transport hub, and a popular tourist destination in its own right.
                </Text>

                <Text style={styles.modalDescription}>
                  Traveling within the region takes 5 to 7 hours, depending on traffic conditions.
                </Text>

                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Address:</Text>
                  <Text style={styles.modalDetails}>Rizal Ave Ext., Cebu City, 6000 Cebu</Text>
                </View>
                  
                <View style={{flexDirection:"row", Width:"50%"}}>
                  <Text style={styles.boldText}>Contact Number:</Text>
                  <TouchableOpacity onPress={() => openLink('tel:+63 032 345 8650')} >
                    <Text style={styles.modalDetails1}>+63 (032) 345 8650</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={() => openLink('https://maps.app.goo.gl/MEp6UAsWoZxktHD16')} >
                  <Text style={styles.googleMapsLink}>Google maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>


          <Modal  animationType="slide" transparent={true} visible={showbus1} onRequestClose={() => setShowBus1(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer2}>

                <View style={styles.header2}>
                  {/* Content */}
                  <Text style={styles.modalTitle}>Regular Provincial Bus</Text>
                </View>   

                <ScrollView style={styles.Scroll}>
                  {/* Placeholder for Image */}
                    <Image source={require('../assets/icons/ss1.png' )} style={styles.logo6} />

                </ScrollView>

                <TouchableOpacity style={styles.closeButton2} onPress={() => setShowBus1(false)} >
                  <Text style={styles.closeButtonText2}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          
          <Modal  animationType="slide" transparent={true} visible={showbus2} onRequestClose={() => setShowBus2(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer2}>

                <View style={styles.header2}>
                  {/* Content */}
                  <Text style={styles.modalTitle}>KingLong Provincial Bus</Text>
                </View>   

                <ScrollView style={styles.Scroll}>
                  {/* Placeholder for Image */}
                    <Image source={require('../assets/icons/ss2.png' )} style={styles.logo4} />
                </ScrollView>

                <TouchableOpacity style={styles.closeButton2} onPress={() => setShowBus2(false)} >
                  <Text style={styles.closeButtonText2}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal  animationType="slide" transparent={true} visible={showbus3} onRequestClose={() => setShowBus3(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cebuModalContainer2}>

                <View style={styles.header2}>
                  {/* Content */}
                  <Text style={styles.modalTitle}>Mini Provincial Bus</Text>
                </View>   

                <ScrollView style={styles.Scroll}>
                  {/* Placeholder for Image */}
                    <Image source={require('../assets/icons/ss3.png' )} style={styles.logo5} />

                </ScrollView>

                <TouchableOpacity style={styles.closeButton2} onPress={() => setShowBus3(false)} >
                  <Text style={styles.closeButtonText2}>Close</Text>
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
    backgroundColor: '#201F59', // Dark blue background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: '3%',
  },
  header2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    borderBottomWidth:2,
    borderColor:"#201F59"
  },
  headerTitle: {
    fontSize: 42,
    color: '#fff',
    fontWeight: '500',
    marginVertical: 25,
  },
  iconContainer: {
    backgroundColor: '#4682B4',
    padding: 10,
    width: '25%',
    height: '100%',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconstyle: {
    marginTop: '15%',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4682B4',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#DDD',
  },
  tab: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '400',
  },
  content: {
    backgroundColor: '#201F59',
  },
  background1: {
    flex: 1,
    resizeMode: 'cover', // Optional: adjusts the image to cover the screen
    justifyContent: 'center', // Align children vertically
    paddingVertical:16,
    paddingHorizontal:16,
    paddingBottom:30
  },
  background2: {
    flex: 1,
    resizeMode: 'cover', // Optional: adjusts the image to cover the screen
    justifyContent: 'center', // Align children vertically
    paddingTop:30,
    paddingBottom:30
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    color: '#FFFFFF',
    marginVertical: 16,
    marginBottom: 30,
    letterSpacing: 2,
  },
  imagePlaceholder1: {
    backgroundColor: '#EEEE',
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 20,
    marginHorizontal:25,
  },
  logo1: {
    width: "99%", 
    height: "98%",
    borderRadius:20,
  },
  
  imageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  description: {
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'justify',
    marginVertical: 20,
    marginHorizontal: 5,
  },
  separator: {
    height: 4,
    backgroundColor: '#dddd',
    marginTop: 10,
    marginBottom:25,
    marginHorizontal:30,
  },
  separator2: {
    height: 1,
    backgroundColor: '#DDDD',
    marginBottom: 8,
  },
  separator3: {
    height: 1,
    backgroundColor: '#DDDD',
    marginTop: 30,
  },
  separator4: {
    height: 2,
    backgroundColor: '#DDDD',
    marginBottom: 30,
  },
  separator5: {
    height: 4,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal:30,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    letterSpacing: 2,
  },
  offerSection: {
    marginTop:10,
    marginBottom: 15,
  },
  offer: {
    backgroundColor: '#EEEE',
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    marginHorizontal:16,
  },
  offerText: {
    fontSize: 24,
    color: '#03346e',
    fontWeight: '500',
    marginTop:10,
  },
  expandedContent: {
    overflow: 'hidden',
    marginHorizontal: 10,
    marginBottom: 15,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#03346e',
    padding: 10,
    textAlign: 'justify',
    lineHeight: 20,
  },


  busUnits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical:10,
    marginHorizontal:15,
  },
  busCard: {
    backgroundColor: '#4682B4',
    width: '48%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  busImagePlaceholder: {
    backgroundColor: '#EEEE',
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
    alignItems:"center"
  },
  logo2: {
    width: "98%", 
    height: "98%",
    borderRadius:10,

  },
  busTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  busDetails: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 3,
  },
  seatLayoutButton: {
    marginTop: 10,
    backgroundColor: '#FFF',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  seatLayoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4682B4',
  },



  terminalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  terminalButton: {
    backgroundColor: '#EEEE',
    borderRadius: 20,
    width: '47%',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  terminalButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#03346e',
  },


  returnButton: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf:"center",
    marginTop:30
  },
  returnButtonText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFF',
    alignSelf:"center",
    letterSpacing:3,
  },

  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#03346e',
  },
  modalDescription: {
    fontSize: 14,
    color: '#03346e',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#03346e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },


  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cebuModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    width: '85%',
    paddingBottom: 25,
    
  },
  closeButtonModal: {
    backgroundColor: '#03346e',
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:"flex-end",
    marginBottom:15,
  },
  closeButtonTextModal: {
    color: '#fff',
    fontWeight: '700',
  },
  imagePlaceholder: {
    backgroundColor: '#03346e',
    width: '90%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    alignSelf:"center"
  },
  logo3: {
    width: "98%", 
    height: "97%",
    borderRadius:10,

  },
  imageText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#03346e',
    marginBottom: 10,
    alignSelf:"center"
  },
  modalDescription: {
    fontSize: 15,
    color: '#03346e',
    textAlign: 'justify',
    marginBottom: 20,
    marginHorizontal:10
  },
  modalDetails: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft:5,
    marginBottom: 5,
    width:"73%",
  },
  modalDetails1: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft:5,
    marginBottom: 5,
    width:"100%",
  },
  boldText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#03346e',
    marginLeft:10,
  },
  googleMapsLink: {
    fontSize: 14,
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginTop: 15,
    marginBottom:10,
    alignSelf:"center"
  },


  imagePlaceholder2: {
    backgroundColor: '#ccc',
    width: '90%',
    height: "85%",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    alignSelf:"center"
  },
  logo6: {
    width:250,
    height:650,
    borderRadius:10,
    alignSelf:"center"
  },
  logo4: {
    width:250,
    height:850,
    borderRadius:10,
    alignSelf:"center"
  },
  logo5: {
    width:300,
    height:550,
    borderRadius:10,
    alignSelf:"center"
  },
  logo3: {
    height:"97%",
    width:"98%",
    borderRadius:10,
    alignSelf:"center"

  },


  cebuModalContainer2: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    width: '85%',
    height:"90%",
    paddingBottom: 25,
  },
  Scroll:{
    flex:1,
    marginVertical:15,
  },
  modalTitlex: {
    fontSize: 20,
    fontWeight: '700',
    color: '#03346e',
  },
  closeButton2: {
    backgroundColor: '#03346e',
    width:"50%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf:"center",
  },
  closeButtonText2: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    alignSelf:"center",
  },
});
export default TheAbout;
