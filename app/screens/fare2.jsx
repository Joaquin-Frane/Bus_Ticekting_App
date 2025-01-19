import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, TextInput, StatusBar, TouchableOpacity, BackHandler } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 
import { useUser } from '../UserContext';  // Import your UserContext
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const BusfareList = ({ activeTab, setActiveTab }) => {
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [busfares, setBusfares] = useState([]);
    const [isPressed1, setIsPressed1] = useState(false);
    
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
        const fetchBusfares = async () => {
            try {
                const busfareCollection = await getDocs(collection(db, 'Fares'));
                const busfareData = busfareCollection.docs.map(doc => ({
                    id: doc.id,  // Document ID
                    ...doc.data()  // Document fields
                }));
                setBusfares(busfareData);
            } catch (error) {
                console.error('Error fetching busfare data: ', error);
            }
        };

        if (user) {  // Ensure the user is logged in
            fetchBusfares();
        }
    }, [user]);  // Dependency array includes 'user' to refetch if user state changes

    const renderItem = ({ item }) => (
        <TouchableOpacity>
        <View style={styles.item}>
            <Text style={[styles.itemText, { width: '45%' }]}>  {item.route}</Text>
            <Text style={[styles.itemText, { width: '35%' }]}>{item.bus_unit_type}</Text>
            <Text style={[styles.itemText, { width: '20%' }]}>P. {item.fare} </Text>
        </View>
        </TouchableOpacity>
    );

    return (
        <View style={{flex:1,}}>
            {/*<StatusBar hidden={true} />*/}
            <Text style={{color:'white', fontSize: 30, paddingVertical: 10, marginLeft: 10, fontWeight:'bold' }}>BUS FARES</Text>
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
                ) : (<Text style={styles.barHeading}>ALL</Text>)}

                <Pressable style={[styles.search, { backgroundColor: isPressed1 ? '#6eacda' : '#191970' }]}
                onPressIn={() => setIsPressed1(true)}
                onPressOut={() => setIsPressed1(false)}
                onPress={() => setSearchMode(!searchMode)}>
                    <Ionicons style={styles.icon} name="search" size={25} color="white"/>
                </Pressable>
            </View>
            <View style={styles.header}>
                <Text style={[styles.headerText, { width: '45%' }]}> Route</Text>
                <Text style={[styles.headerText, { width: '35%' }]}>Unit Type</Text>
                <Text style={[styles.headerText, { width: '20%' }]}>Fare</Text>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={busfares.filter((busfare) => {
                    for (let key in busfare) {
                        if (key !== "id" && typeof busfare[key] === "string") {
                            if (busfare[key].toLowerCase().includes(searchText.toLowerCase())) {
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
                        <Text style={styles.emptyText}>Loading Fares ...</Text>
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
        paddingBottom:10,
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
        //fontFamily: 'Poppins SemiBold',
        color: '#fff',
        fontSize: 20,
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
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    headerText: {
        //fontFamily: 'Poppins SemiBold',
        fontSize: 17,
        color: '#fff',
        fontWeight: 'bold'
    },
    item: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#191970',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemText: {
        fontSize: 12,
        //fontFamily: 'Poppins Regular',
        marginBottom: 5,
        paddingRight: 10,
        color:"#191970",
        fontWeight:"500",
        letterSpacing:1
    },
    input: {
        borderColor: '#fff',
        borderBottomWidth: 1,
        flex: 1,
        marginRight: 20,
        //fontFamily: 'Poppins Medium',
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

export default BusfareList;
