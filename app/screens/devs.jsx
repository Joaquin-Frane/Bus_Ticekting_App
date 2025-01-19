import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Modal, Linking, BackHandler} from 'react-native';
import { useState , useEffect} from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Devs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>The</Text>
            <Text style={styles.headerTitle}>Developers</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome style={styles.iconstyle} name="code" size={50} color="#fff" />
          </View>
        </View>

        <View style={styles.thebar} onPress={() => setModalVisible(true)}>
        <Text style={styles.nameText3}>Front-End</Text>
        <Text style={styles.nameText3}>Back-End</Text>
        <Text style={styles.nameText3}>Database</Text>
        </View>

        {/* Front End Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FRONT END</Text>
          <View style={styles.sectionContent}>
            <View style={styles.textBoxContainer}>
              <View style={styles.textBox}>
                  <ScrollView style={styles.scrollableTextBox} nestedScrollEnabled={true} >
                    <Text style={styles.sectionDescription}>
                    The design layouts you see in this app is he’s doings. So if you have problems with colors and the shapes of buttons, blame that guy!! 
                    </Text>
                    <Text style={styles.sectionDescription}>(He kills one of our backend !!)</Text>
                  </ScrollView>
              </View>
              <View style={styles.bottomBorder} />
              <View style={styles.footerRow}>
                <View style={styles.dotsContainer}>
                  <Ionicons name="logo-html5" size={20} color="#bbb" style={styles.dot} />
                  <Ionicons name="logo-css3" size={20} color="#ff6f3f" style={styles.dot} />
                  <Ionicons name="logo-react" size={20} color="#bbb" style={styles.dot} />
                </View>
                <TouchableOpacity>
                  <Text style={styles.moreText}>More &gt;&gt;</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.circleContainer}>
              <View style={styles.circle}>
                <Image source={require("../assets/icons/icon1a.jpg")} style={styles.logo}/>
              </View>
              <Text style={styles.nameText}>Joaquin A.</Text>
            </View>
          </View>
        </View>

        {/* Back End Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle1}>BACK END</Text>
          <View style={styles.sectionContent}>
          <View style={styles.circleContainer1}>
              <View style={styles.circle1}>
              <Image source={require("../assets/icons/icon2.jpg")} style={styles.logo}/>
              </View>
              <Text style={styles.nameText1}>Joaquin B2</Text>
          </View>
            <View style={styles.textBoxContainer1}>
              <View style={styles.textBox1}>
                <Text style={styles.sectionDescription}>
                He do all the things that is usefull in this app, he is the one making this trash moves (he’s the replacement of our dead Back-end dev.). Hes scared of Joaquin A so he do his best to satisfy that Bitch
                </Text>
              </View>
              <View style={styles.bottomBorder1} />
              <View style={styles.footerRow1}>
                <View style={styles.dotsContainer}>
                  <Ionicons name="logo-react" size={20} color="#bbb" style={styles.dot1} />
                  <Ionicons name="logo-python" size={20} color="#ff6f3f" style={styles.dot1} />
                  <Ionicons name="logo-javascript" size={20} color="#bbb" style={styles.dot1} />
                </View>
                <TouchableOpacity>
                  <Text style={styles.moreText1}>More &gt;&gt;</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Database Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA BASE</Text>
          <View style={styles.sectionContent}>
            <View style={styles.textBoxContainer}>
              <View style={styles.textBox}>
                  <ScrollView style={styles.scrollableTextBox} nestedScrollEnabled={true}>
                    <Text style={styles.sectionDescription}>
                      He a great guy! Do all the data management and security stuff with the cloud (Joaquin A cant kil him cause he knows Karate). If you have problem with your data or wants to delete it , hes the guy who sets all of that (be careful he might delete you irl).
                    </Text>
                  </ScrollView>
              </View>
              <View style={styles.bottomBorder} />
              <View style={styles.footerRow}>
                <View style={styles.dotsContainer}>
                  <Ionicons name="logo-react" size={20} color="#bbb" style={styles.dot} />
                  <Ionicons name="logo-firebase" size={20} color="#ff6f3f" style={styles.dot} />
                  <Ionicons name="logo-python" size={20} color="#bbb" style={styles.dot} />
                </View>
                <TouchableOpacity>
                  <Text style={styles.moreText}>More &gt;&gt;</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Section */}
            <View style={styles.circleContainer}>
              <View style={styles.circle}>
                <Image source={require("../assets/icons/icon3.jpg")} style={styles.logo}/>
              </View>
              <Text style={styles.nameText}>Joaquin C.</Text>
            </View>
          </View>
        </View>

        {/* Return Button */}
        <TouchableOpacity style={styles.returnButton} onPress={() => setModalVisible(true)}>
        <Image source={require("../assets/icons/whitewing.png")} style={styles.logo1} />
        <Text style={styles.nameText2}>JOAQUIN </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.returnButton1} onPress={() => navigation.navigate('About')}>
          <Text style={styles.returnText}>RETURN</Text>
        </TouchableOpacity>

        {/* Modal */}
              <Modal    animationType="slide"    transparent={true}    visible={modalVisible}    onRequestClose={() => setModalVisible(false)} >
                <View style={styles.modalBackground}>
                <ScrollView contentContainerStyle={styles.modalContent}>
                  <View style={styles.modalContainer}>
                      {/* Header */}
                      <View style={styles.socialsContainer1}>
                        <View>
                          <Text style={styles.title}>The Real</Text>
                          <Text style={styles.title1}>Developer :</Text>
                        </View>
                        <TouchableOpacity style={styles.circle3} onPress={() => setModalVisible(false)}>
                            <Ionicons name="chevron-down-outline" size={40} color="#fff" style={styles.dot5} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.bottomBorder3} />
                      <View style={styles.circle2}>
                        {/* Profile Picture Placeholder */}
                        <Image source={require('../assets/icons/icon4.jpg' )} style={styles.profileImage} />
                      </View>
        
                      <Text style={styles.name}>JOAQUIN F. JACA</Text>
                      <View style={styles.dotsContainer2}>
                        <FontAwesome name="database" size={22} color="#bbb" style={styles.dot2} />
                        <Ionicons name="code-slash" size={40} color="#ff6f3f" style={styles.dot2} />
                        <Ionicons name="desktop-outline" size={25} color="#bbb" style={styles.dot2} />
                      </View>
                      <Text style={styles.description}>
                        An undergrad developer specializing in back-end development and database management. (Occasionally doing web design and mobile user interfaces).
                      </Text>
        
                      {/* Masteries Section */}
                      <Text style={styles.masteriesTitle}>--- MASTERIES ---</Text>
                      <View style={styles.dotsContainer2}>
                        <Ionicons name="logo-html5" size={20} color="#bbb" style={styles.dot3} />
                        <Ionicons name="logo-css3" size={20} color="#bbb" style={styles.dot3} />
                        <Ionicons name="logo-javascript" size={20} color="#bbb" style={styles.dot3} />
                        <Ionicons name="logo-react" size={20} color="#bbb" style={styles.dot3} />
                        <Ionicons name="logo-firebase" size={20} color="#bbb" style={styles.dot3} />
                        <FontAwesome5 name="php" size={25} color="#bbb" style={styles.dot3} />
                        <Ionicons name="logo-python" size={20} color="#bbb" style={styles.dot3} />
                      </View>
        
                      {/* Masteries List */}
                      <View style={styles.mastery}>
                        <View style={styles.masteryBullet}>
                          <Ionicons name="code-slash" size={20} color="#fff" style={styles.dot4} />
                        </View>
                        <Text style={styles.masteryText}>
                          I have basic knowledge in Web development through scripting languages (e.g., HTML, CSS, PHP, and JavaScript).
                        </Text>
                      </View>
                      <View style={styles.mastery}>
                        <View style={styles.masteryBullet}>
                          <Ionicons name="logo-react" size={20} color="#fff" style={styles.dot4} />
                        </View>
                        <Text style={styles.masteryText}>
                          I have basic knowledge in programming with React Native for mobile development using Expo, making me capable of creating functional and useful mobile applications.
                        </Text>
                      </View>
                      <View style={styles.mastery}>
                        <View style={styles.masteryBullet}>
                          <Ionicons name="logo-python" size={20} color="#fff" style={styles.dot4} />
                        </View>
                        <Text style={styles.masteryText}>
                          I have basic knowledge in Python, especially in software development, developing visually appealing applications using Tkinter and CustomTkinter libraries.
                        </Text>
                      </View>
                      <View style={styles.mastery}>
                        <View style={styles.masteryBullet}>
                          <Ionicons name="logo-firebase" size={20} color="#fff" style={styles.dot4} />
                        </View>
                        <Text style={styles.masteryText}>
                          I have basic knowledge in both SQL and NoSQL databases through XAMPP (PHP) and Firebase Database, giving me versatility in database management.
                        </Text>
                      </View>

                      {/* Projects Section */}
                    <Text style={styles.projectsTitle}>--- PROJECTS ---</Text>
                    <Text style={styles.projectDescription}>
                    {'     '} I have worked on a web-based online Library Management System for Colegio De Montalbano (as an undergrad project). The system
                      is complete with book look-up, account registration, book inventory management system, and an online book lending system for students.
                    </Text>
                  <View style={styles.projectImageContainer}>
                    <Image source={require('../assets/icons/PROJ1.png' )} style={styles.projectImagePlaceholder} />
                  </View>

                    <Text style={styles.projectDescription2}>
                    {'     '} I am currently working on an integrated bus ticketing system using QR code technology. I am handling the database management,
                      IoT integration (thermal printer and QR code scanner), desktop software development (for bus operation management and in-terminal
                      ticket generation and validation), and mobile application (for user booking, payment, and bus information access).
                    </Text>
                  <View style={styles.projectImageContainer}>
                      <Image source={require('../assets/icons/PROJ2.png' )} style={styles.projectImagePlaceholder}/>
                  </View>

                  {/* Socials Section */}
                  <Text style={styles.socialsTitle}>--- SOCIALS ---</Text>
                  <View style={styles.socialsContainer}>
                    <TouchableOpacity onPress={() => openURL('https://www.facebook.com/joaquin.jaca.12')}>
                      <Ionicons name="logo-facebook" size={50} color="#ff6f3f" style={styles.socialDot} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openURL('mailto:jaca.joaquin.02.12.2003@gmail.com')}>
                      <Ionicons name="at-circle" size={50} color="#ff6f3f" style={styles.socialDot} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.bottomBorder3} />
                      {/* Close Button */}
                      <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>CLOSE</Text>
                      </TouchableOpacity>
                  </View>
                  </ScrollView>
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
    backgroundColor: '#2b2b2b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: '3%',
  },
  headerTitle: {
    fontSize: 45,
    color: '#ff6f3f',
    fontWeight: '500',
  },
  bottomBorder: {
    height: 2, // Thickness of the border
    backgroundColor: '#ff6f3f', // Border color
    marginTop:10,
    marginRight:10,
    marginBottom:5
  },
  bottomBorder1: {
    height: 2, // Thickness of the border
    backgroundColor: '#ff6f3f', // Border color
    marginTop:10,
    marginLeft:10,
    marginBottom:5
  },
  bottomBorder3: {
    height: 2, // Thickness of the border
    backgroundColor: '#ff6f3f', // Border color
    marginTop:10,
    marginBottom:15
  },
  iconContainer: {
    backgroundColor: '#ff6f3f',
    padding: 10,
    width: '25%',
    height: '100%',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconstyle:{
    marginTop:"30%"
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
  thebar: {
    flexDirection:"row",
    paddingVertical:5,
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor: '#555',
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal:10,
    borderWidth:2,
    borderTopColor:"#ff6f3f",
    borderBottomColor:"#ff6f3f"
  },
  section: {
    backgroundColor: '#333',
    marginVertical: 15,
    paddingVertical: "5%",
    //borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 30,
    color: '#ff6f3f',
    marginBottom: 15,
    fontWeight: '500',
    letterSpacing:3.5,
    textDecorationLine:"underline",
    marginLeft:15
  },
  sectionTitle1: {
    fontSize: 30,
    color: '#ff6f3f',
    marginBottom: 15,
    fontWeight: '500',
    letterSpacing:3.5,
    alignSelf:"flex-end",
    textDecorationLine:"underline",
    marginRight:15
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBoxContainer: {
    flex: 2,
    marginHorizontal:10
  },
  textBoxContainer1: {
    flex: 2,
    marginHorizontal:10
  },
  textBox: {
    backgroundColor: '#222',
    padding: 5,
    borderRadius: 5,
    marginRight:15,
    marginBottom:0
  },
  textBox1: {
    backgroundColor: '#222',
    padding: 5,
    borderRadius: 5,
    marginLeft:15,
    marginBottom:0
  },
  scrollableTextBox: {
    maxHeight: 140, // Set the maximum height for the scrollable area
    paddingHorizontal: 3,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal:0,
    marginBottom:5
  },
  footerRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal:0,
    marginBottom:5
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    marginRight: 10,
    marginLeft: 2,
  },
  dot1: {
    marginRight: 2,
    marginLeft: 10,
  },
  moreText: {
    fontSize: 18,
    color: '#ff6f3f',
    fontWeight: '400',
    marginRight:10
  },
  moreText1: {
    fontSize: 18,
    color: '#ff6f3f',
    fontWeight: '400',
    marginLeft:10
  },
  circleContainer: {
    alignItems: 'center',
    flex:1,
    marginHorizontal:10,
    alignSelf:"flex-start",
  },
  circleContainer1: {
    alignItems: 'center',
    flex:1,
    marginHorizontal:10,
    alignSelf:"flex-start",
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#ff6f3f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginRight:15
  },
  circle1: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#ff6f3f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginLeft:15
  },
  nameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    alignSelf:"center",
    marginRight:15,
    marginTop:5
  },
  nameText3: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    alignSelf:"center",
  },
  nameText1: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    alignSelf:"center",
    marginTop:5,
  },
  nameText2: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    alignSelf:"center",
    marginTop:5,
    letterSpacing:2,
  },
  subText: {
    color: '#ff6f3f',
    fontSize: 14,
    fontWeight: '400',
  },
  returnButton: {
    flexDirection:"row",
    justifyContent:"center",    
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginTop: 20,
    marginBottom:10,
    borderTopWidth:2,
    borderBottomWidth:2,
    borderColor:"#ff6f3f"
  },
  returnButton1: {
    alignSelf: 'center',
    padding: 10,
    width:"30%",
    backgroundColor: '#ff6f3f',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 30,
  },
  returnText: {
    fontSize: 16,
    color: '#fff',
    alignSelf:"center",
    fontWeight: '500',
    letterSpacing:2,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#ff6f3f',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  modalContainer: {
    width: '95%',
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 10,
    elevation: 10,
    borderWidth:2,
    borderColor: "#ff6f3f",
    marginVertical:"5%",
    marginBottom:80,
  },
  modalContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    color: '#ff6f3f',
    letterSpacing:2,
    //marginBottom: 20,
  },
  title1: {
    fontSize: 30,
    fontWeight: '500',
    color: '#ff6f3f',
    letterSpacing:2,
  },
  circle2: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#ff6f3f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    alignSelf:"center",
    marginTop:"10%",
    marginBottom:"7%",
  },
  circle3: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: '#ff6f3f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 147,
    height: 147,
    borderRadius: 100,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 10,
    alignSelf:"center",
    letterSpacing:1.5,
  },
  dotsContainer2: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    alignSelf:"center",
    marginTop:5
    
  },
  description: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    alignSelf:"center",
    marginHorizontal:5,
  },
  dot2: {
    alignSelf:"center",
    marginHorizontal:15
  },
  dot3: {
    alignSelf:"center",
    marginHorizontal:10
  },
  dot4: {
    alignSelf:"center",
  },
  dot5: {
    alignSelf:"center",
  },
  masteriesTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#ff6f3f',
    marginTop:"10%",
    marginBottom: 15,
    alignSelf:"center",
    letterSpacing:2.5,
  },
  mastery: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  masteryBullet: {
    width: 25,
    height: 25,
    backgroundColor: '#ff6f3f',
    borderRadius: 5,
    marginRight: 20,
    marginTop: 0,
    marginLeft:10,
    justifyContent:"center",
    alignSelf:"center"
  },
  masteryText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#ff6f3f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width:150,
    alignSelf:"center",
    alignItems:"center",
    marginBottom:10
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing:2,

  },
  projectsTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#ff6f3f',
    marginTop:"15%",
    marginBottom: "10%",
    alignSelf:"center",
    letterSpacing:2.5,
  },
  projectDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'justify',
    marginHorizontal:10,
    marginBottom: 15,
  },
  projectDescription2: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'justify',
    marginHorizontal:10,
    marginBottom: 0,
  },
  projectImageContainer: {
    alignItems: 'center',
    marginBottom: "15%",
    marginTop:15
  },
  projectImagePlaceholder: {
    width: 250,
    height: 150,
    backgroundColor: '#333',
    borderRadius: 10,
    borderWidth:1,
    borderColor:"#ff6f3f"
  },

  socialsTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#ff6f3f',
    marginTop:"5%",
    marginBottom: "5%",
    alignSelf:"center",
    letterSpacing:2.5,
  },
  socialsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialsContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:"center",
    marginHorizontal:10
  },
  socialDot: {
    marginHorizontal: 15,
  },
});

export default Devs;
