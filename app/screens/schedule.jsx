import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Pressable, ActivityIndicator, BackHandler } from 'react-native';
import { getFirestore, collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { useUser } from '../UserContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modal, Alert } from 'react-native';

const ScheduleList = ({ activeTab, setActiveTab, selectedRoute }) => {
    const route = useRoute();
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState(selectedRoute);
    const [schedules, setSchedules] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [isPressed, setIsPressed] = useState(false);
    const [isPressed1, setIsPressed1] = useState(false);

    const navigation = useNavigation();
    const { user } = useUser();
    const db = getFirestore();

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (activeTab !== 'Home') {
                setActiveTab('Home');  // Switch to Home tab when back button is pressed
                return true;  // Prevent the default back button behavior
            }
            return false;  // Allow the default back button behavior (exit app or go back)
        });
    
        // Cleanup when component is unmounted or activeTab changes
        return () => backHandler.remove();
    }, [activeTab]); 

    const fetchSchedules = async (isInitialLoad = false) => {
        if (loading || loadingMore) return;

        if (isInitialLoad) setLoading(true);
        else setLoadingMore(true);

        try {
            const today = new Date().toISOString().split('T')[0]; // Get current date in "YYYY-MM-DD" format
            const scheduleQuery = query(
                collection(db, 'BusSchedule'),
                where('departure_date', '>=', today), // Filter out past dates
                where('status', '!=', 'Cancelled'),
                orderBy('departure_date'),
                limit(30),
                ...(lastDoc ? [startAfter(lastDoc)] : [])
            );

            const scheduleSnapshot = await getDocs(scheduleQuery);
            const scheduleData = scheduleSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter(doc => !schedules.some(schedule => schedule.id === doc.id)); // Avoid duplicates

            setSchedules(prevSchedules => [...prevSchedules, ...scheduleData]);
            setLastDoc(scheduleSnapshot.docs[scheduleSnapshot.docs.length - 1]);

        } catch (error) {
            console.error('Error fetching schedule data: ', error);
        } finally {
            if (isInitialLoad) setLoading(false);
            else setLoadingMore(false);
        }
    };

    const handleBuyTicket = (schedule) => {
        const availableSeats = item.seats ? Object.values(item.seats).filter(status => status === 'Available').length : 0;

        if (availableSeats.length > 0) {
            // Navigate to the seat booking page
            navigation.navigate('seat', { scheduleID: schedule.id });
        } else {
            // Show the "Fully Booked" modal
            setIsModalVisible(true);
        }
    };
    



    useEffect(() => {
        if (user) {
            fetchSchedules(true);
        }
    }, [user]);

    const toggleExpand = (id) => {
        setExpanded((prevId) => (prevId === id ? null : id));
    };

    const renderItem = ({ item }) => {
        const availableSeats = item.seats ? Object.values(item.seats).filter(status => status === 'Available').length : 0;
    
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                    <View style={styles.cardHeader}>
                        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={styles.itemText2}>Route:</Text>
                            <Text style={styles.itemText1}>  {item.route}</Text>
                        </View>
                        <AntDesign name={expanded === item.id ? 'up' : 'down'} size={20} color="#191970" />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', marginRight: 35 }}>
                        <Text style={styles.itemText}>Date:  {item.departure_date ?? "N/A"}</Text>
                        <Text style={styles.itemText}>Time:  {item.departure_time ?? "N/A"}</Text>
                    </View>
                    {expanded === item.id && (
                        <View style={styles.cardContent}>
                            <Text style={styles.itemText}>     Bus ID:   {item.bus_id ?? "N/A"}</Text>
                            <Text style={styles.itemText}>
                                Available seats: {availableSeats} / {item.no_of_seats ?? "N/A"}
                            </Text>
                            <Text style={styles.itemText}>     Price:   {item.fare ?? "N/A"} PHP</Text>
                            <Pressable
                                style={[styles.Button, { backgroundColor: isPressed ? '#0079c1' : '#191970' }]} 
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                                onPress={() => {
                                    if (availableSeats === 0) {
                                        setIsModalVisible(true);
                                    } else {
                                        navigation.navigate('seat', { scheduleID: item.id });
                                    }
                                }}
                            >
                                <Ionicons name='ticket' size={20} color="#fff" />
                                <Text style={{ color: "#fff", fontSize: 16 }}>Book a Seat</Text>
                            </Pressable>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    const handleLoadMore = () => {
        fetchSchedules(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>BUS SCHEDULES</Text>
            <View style={styles.container}>
                <View style={styles.bar}>
                    {searchMode ? (
                        <TextInput
                            placeholder='Search'
                            placeholderTextColor='#fff'
                            style={styles.input}
                            value={searchText}
                            onChangeText={val => setSearchText(val)}
                        />
                    ) : (<Text style={styles.barHeading}>Search Bus Schedule</Text>)}

                    <Pressable style={[styles.search,  { backgroundColor: isPressed1 ? '#0079c1' : '#191970' }]}
                        onPress={() => setSearchMode(!searchMode)} 
                        onPressIn={() => setIsPressed1(true)}
                        onPressOut={() => setIsPressed1(false)}>
                        <Ionicons style={styles.icon} name="search" size={25} color="white" />
                    </Pressable>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#191970" />
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={schedules.filter(schedule => {
                            for (let key in schedule) {
                                if (key !== "id" && typeof schedule[key] === "string") {
                                    if (schedule[key].toLowerCase().includes(searchText.toLowerCase())) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        })}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={loadingMore && <ActivityIndicator size="small" color="#191970" />}
                    />
                )}
            </View>
            <Modal
                animationType="fade"
                 transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>This trip is fully booked!</Text>
                        <TouchableOpacity  style={styles.closeButtonf} onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        color: 'white',
        fontSize: 30,
        paddingVertical: 15,
        marginLeft: 10,
        fontWeight: 'bold',
        textShadowColor: '#191970',        // Shadow color
        textShadowOffset: { width: 1, height: 1 }, // Shadow offset
        textShadowRadius: 1, 
    },
    container: {
        flex: 1,
        borderRadius: 10,
        backgroundColor:"#e0e0e0",
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        paddingBottom:10
    },
    bar: {
        backgroundColor: '#191970',
        width: '100%',
        height: 60,
        marginBottom: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        flexDirection: "row",
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    barHeading: {
        color: '#fff',
        fontSize: 20,
        borderColor: '#fff',
        borderBottomWidth: 1,
    },
    icon: {
        width: 25,
        height: 25,
    },
    card: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        marginVertical:5,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal:5
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        marginTop: 10,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
        color:"#191970"
    },
    itemText1: {
        fontSize: 18,
        marginBottom: 5,
        color:"#191970",
        fontWeight:"bold",
    },
    itemText2: {
        fontSize: 18,
        marginBottom: 5,
        color:"#191970",
    },
    input: {
        borderColor: '#fff',
        borderBottomWidth: 1,
        flex: 1,
        marginRight: 20,
        fontSize: 14.5,
        padding: 0,
        color: '#fff',
    }, 
    Button:{
        flexDirection:"row",
        justifyContent:"space-evenly",
        backgroundColor:"#191970",
        alignItems:'center',
        marginHorizontal:'25%',
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 5
    },
    search:{
        padding:10,
        borderRadius:10
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        color: '#191970',
        marginBottom: 20,
        marginTop: 20,
        fontWeight: '700',
        letterSpacing:1,
    },
    closeButton: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButtonf: {
        paddingHorizontal:20,
       backgroundColor: '#6eacda',
       paddingVertical:5,
       borderRadius:10,
       marginVertical:10,

    },
});

export default ScheduleList;
