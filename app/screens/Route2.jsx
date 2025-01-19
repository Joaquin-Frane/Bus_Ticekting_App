import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, TextInput, StatusBar, TouchableOpacity , BackHandler} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 
import { useUser } from '../UserContext';  // Import your UserContext
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';  // Import navigation hook

const RouteList = ({ activeTab, setActiveTab, setSelectedRoute }) => {
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [routes, setRoutes] = useState([]);
    const [isPressed1, setIsPressed1] = useState(false);


    const navigation = useNavigation();  // Access navigation object
    
    // Get user and Firestore database from UserContext
    const { user } = useUser();  // Assuming 'useUser' returns an object with 'user'
    const db = getFirestore();  // Access Firestore database
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


    // Fetch data from Firestore on component mount
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const routeCollection = await getDocs(collection(db, 'BusRoutes'));
                const routeData = routeCollection.docs.map(doc => ({
                    id: doc.id,  // Document ID
                    ...doc.data()  // Document fields
                }));
                setRoutes(routeData);
            } catch (error) {
                console.error('Error fetching route data: ', error);
            }
        };

        if (user) {  // Ensure the user is logged in
            fetchRoutes();
        }
    }, [user]);  // Dependency array includes 'user' to refetch if user state changes

    const renderItem = ({ item }) => (
        <TouchableOpacity   onPress={() => {
            setSelectedRoute(item.id); // Pass the desired string here
            setActiveTab('Schedule'); // Navigate to the Schedule tab
          }} >
        <View style={styles.item}>
            <Text style={[styles.itemText1, { width: '44%' }]}>  {item.id}</Text>
            <Text style={[styles.itemText, { width: '25%' }]}>{item.distance}  km</Text>
            <Text style={[styles.itemText, { width: '28%' }]}>{item.approx_time}  hrs.</Text>
        </View>
        </TouchableOpacity>
    );

    return (
        <View style={{flex: 1 }}>
            <Text style={{color:'white', fontSize: 30, paddingVertical: 10, marginLeft: 10, fontWeight:'bold',textShadowColor: '#191970', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1,  }}> BUS ROUTES</Text>
        <View style={styles.container}>
            {/*<StatusBar hidden={true} />*/}
            <View style={styles.bar}>
                {searchMode ? (
                    <TextInput
                        placeholder='Search'
                        placeholderTextColor='#fff'
                        style={styles.input}
                        value={searchText}
                        onChangeText={val => setSearchText(val)}
                    />
                ) : (<Text style={styles.barHeading}>ALL ROUTES  </Text>)}

                <Pressable style={[styles.search, { backgroundColor: isPressed1 ? '#6eacda' : '#191970' }]} 
                onPressIn={() => setIsPressed1(true)}
                onPressOut={() => setIsPressed1(false)}
                onPress={() => setSearchMode(!searchMode)}>
                <Ionicons style={styles.icon} name="search" size={25} color="white"/>
                </Pressable>
            </View>
            <View style={styles.header}>
                <Text style={[styles.headerText, { width: '45%' }]}>  Route </Text>
                <Text style={[styles.headerText, { width: '25%' }]}>Distance</Text>
                <Text style={[styles.headerText, { width: '30%' }]}>Travel Time</Text>
            </View>
            <FlatList style={{marginBottom:10, backgroundColor:"#e0e0e0"}}
                showsVerticalScrollIndicator={false}
                data={routes.filter((route) => {
                    for (let key in route) {
                        if (key !== "id" && typeof route[key] === "string") {
                            if (route[key].toLowerCase().includes(searchText.toLowerCase())) {
                                return true;
                            }
                        }
                    }
                    return false;
                })}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Loading Routes ...</Text>
                    </View>
                }
            />
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    bar: {
        backgroundColor: '#191970',
        width: '100%',
        height: 60,
        marginBottom: 0,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        alignItems: 'center',
        flexDirection: "row",
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    barHeading: {
        color: '#fff',
        fontSize: 17,
        borderColor: '#fff',
        borderBottomWidth: 1,
    },
    icon: {
        width: 25,
        height: 25,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#c0c0c0',
        paddingVertical: 15,
        paddingHorizontal: 5,
    },

    headerText: {
        fontSize: 15,
        color:"#191970",
        fontWeight: 'bold',
    },
    item: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#191970',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:"#fff",
    },
    itemText: {
        fontSize: 14,
        marginBottom: 5,
        paddingRight: 5,
        color:"#191970"
    },
    itemText1: {
        fontSize: 15,
        marginBottom: 5,
        paddingRight: 10,
        color:"#191970",
        fontWeight :"bold",
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
    search:{
        padding:10,
        borderRadius:10
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 20,
        color: '#555',
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing:1
    },
});

export default RouteList;
