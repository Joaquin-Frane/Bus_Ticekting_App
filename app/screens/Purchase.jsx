import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, StatusBar, Pressable, Alert, BackHandler, Modal } from 'react-native';
import { getFirestore, collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useUser } from '../UserContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const PurchaseList = ({ activeTab, setActiveTab }) => {
    const navigation = useNavigation();
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [purchases, setPurchases] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [isPressed, setIsPressed] = useState(false);
    const [isPressed1, setIsPressed1] = useState(false);
    const [isPressed2, setIsPressed2] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);  // state to handle modal visibility
    const [selectedPurchase, setSelectedPurchase] = useState(null);  // state to store selected purchase for deletion
    const [isModalPressed, setIsModalPressed] = useState(false);
    const [isModalPressed1, setIsModalPressed1] = useState(false);

    const { user } = useUser();
    const db = getFirestore();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (activeTab !== 'Home') {
                setActiveTab('Home');
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [activeTab]);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                if (user) {
                    const purchasesQuery = query(collection(db, `MobileUser/${user.uid}/Purchase`));
                    const purchaseSnapshot = await getDocs(purchasesQuery);

                    const purchaseData = purchaseSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setPurchases(purchaseData);
                }
            } catch (error) {
                console.error('Error fetching purchase data: ', error);
            }
        };

        fetchPurchases();
    }, [user]);

    const toggleExpand = (id) => {
        setExpanded(prevState => ({
            [id]: !prevState[id]
        }));
    };

    const handleDelete = async () => {
        if (selectedPurchase) {
            try {
                const purchaseDocRef = doc(db, `MobileUser/${user.uid}/Purchase`, selectedPurchase.id);
                await deleteDoc(purchaseDocRef);
                setPurchases(prevPurchases => prevPurchases.filter(purchase => purchase.id !== selectedPurchase.id));

                Toast.show({
                    type: 'info',
                    text1: 'Ticket Deleted!',
                    text2: `ID: ${selectedPurchase.id}`,
                    visibilityTime: 3000,
                });
            } catch (error) {
                console.error('Error deleting document:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Failed to Delete Ticket',
                    text2: `Error: ${error.message}`,
                    visibilityTime: 2500,
                });
            }
        }

        setModalVisible(false);  // close the modal after deletion
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="ellipse" size={20}
                            color={item.status === 'Active' ? '#06D001' :
                                item.status === 'Delayed' ? 'orange' :
                                item.status === 'Cancelled' ? 'red' :
                                item.status === 'Refunded' ? '#007BFF' :
                                item.status === 'Used' ? 'gray' :
                                 '#D6D8DB'}

                        />
                        <Text style={styles.itemText1}>  Route: </Text>
                        <Text style={styles.itemText2}>{item.route}</Text>
                    </View>

                    <AntDesign name={expanded[item.id] ? 'up' : 'down'} size={20} color="#191970" />
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', marginRight: 35 }}>
                    <Text style={styles.itemText3}>Date:  <Text style={styles.itemText6}>{item.departure_date || 'N/A'}</Text></Text>
                    <Text style={styles.itemText}>Time:  <Text style={styles.itemText6}>{item.departure_time || 'N/A'}</Text></Text>
                </View>
                {expanded[item.id] && (
                    <View style={styles.cardContent}>
                        <Text style={styles.itemText}>     Seat No:    <Text style={styles.itemText4}>{item.bus_seat || 'N/A'}</Text></Text>
                        <Text style={styles.itemText}>          Price:    <Text style={styles.itemText4}>{item.price} PHP</Text></Text>
                        <Text style={styles.itemText}>        Status:    <Text style={styles.itemText4}>{item.status || 'N/A'}</Text></Text>
                        

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable style={[styles.Button, { backgroundColor: isPressed ? '#0079c1' : '#191970' }]}
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                                onPress={() => navigation.navigate('TicketInfo2', { itemId: item.id, tripId: item.TripID })}>
                                <Text style={{ color: "#fff", fontSize: 16, letterSpacing: 1, fontWeight: "bold" }}>   View ticket   </Text>
                            </Pressable>
                            <Pressable style={[styles.ButtonDel, { backgroundColor: isPressed2 ? 'red' : '#fff' }]}
                                onPressIn={() => setIsPressed2(true)}
                                onPressOut={() => setIsPressed2(false)}
                                onPress={() => {
                                    setSelectedPurchase(item);  // set selected purchase for deletion
                                    setModalVisible(true);  // show the modal
                                    }} >
                                <AntDesign name='delete' size={35} color="red" style={{ color: isPressed2 ? '#fff' : 'red' }} />
                            </Pressable>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 30, paddingVertical: 10, fontWeight: 'bold' }}> PURCHASED TICKETS </Text>
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
                    ) : (<Text style={styles.barHeading}>SEARCH TICKETS</Text>)}
                    <Pressable style={[styles.search, { backgroundColor: isPressed1 ? '#6eacda' : '#191970' }]}
                        onPress={() => setSearchMode(!searchMode)}
                        onPressIn={() => setIsPressed1(true)}
                        onPressOut={() => setIsPressed1(false)}>
                        <Ionicons style={styles.icon} name="search" size={25} color="white" />
                    </Pressable>
                </View>
                <FlatList
                    data={purchases.filter(purchase =>
                        Object.keys(purchase).some(key =>
                            typeof purchase[key] === "string" && purchase[key].toLowerCase().includes(searchText.toLowerCase())
                        )
                    )}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No Purchase Tickets yet</Text>
                        </View>
                    }
                />
            </View>

            {/* Modal for Deletion Confirmation */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Deletion</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to delete this purchase? 
                        </Text>
                        {selectedPurchase && (
                            <View style={styles.modalContent1}>
                                
                                <Text style={styles.modalMessage1}>Route: <Text style={styles.modalMessage3}>{selectedPurchase.route}</Text></Text>
                                <Text style={styles.modalMessage1}>Status: <Text style={styles.modalMessage3}>{selectedPurchase.status}</Text></Text>
                                <Text style={styles.modalMessage2}>ID: <Text style={styles.modalMessage3}>{selectedPurchase.id}</Text></Text>
                            </View>
                        )}
                        <View style={styles.modalButtons}>

                            <Pressable style={[styles.cancelButton, { backgroundColor: isModalPressed ? '#ccc' : '#777' },  { borderColor: isModalPressed ? '#ccc' : '#777' }]} 
                                onPressIn={() => setIsModalPressed(true)}
                                onPressOut={() => setIsModalPressed(false)}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>

                            <Pressable style={[styles.deleteButton, { backgroundColor: isModalPressed1 ? '#fff' : '#f22' }]} 
                                onPressIn={() => setIsModalPressed1(true)}
                                onPressOut={() => setIsModalPressed1(false)}
                                onPress={handleDelete}>
                                <Text style={[styles.buttonText, { color: isModalPressed1 ? '#f22' : '#fff' }]}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        paddingBottom: 10
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
        backgroundColor: '#fff',
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
        color:"#666",
        marginLeft:"3%"
    },
    itemText1: {
        fontSize: 18,
        marginBottom: 5,
        color:"#666",
    },
    itemText2: {
        fontSize: 18,
        marginBottom: 5,
        color:"#191970",
        fontWeight:"bold",
        letterSpacing:1,
    },
    itemText3: {
        fontSize: 16,
        marginBottom: 5,
        color:"#666",
        marginLeft:"11%"
    },
    itemText4: {
        fontSize: 16,
        marginBottom: 5,
        color:"#191970",
        marginLeft:"11%",
        letterSpacing:1,
        fontWeight:"500"
    },
    itemText6: {
        fontSize: 16,
        marginBottom: 5,
        color:"#191970",
        fontWeight:"500"
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
    Button: {
        backgroundColor: "#191970",
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        width: 150,
        marginLeft:"10%"

    },
    ButtonDel:{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius:10
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
    modalContent1: {
        alignItems: 'left',
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15,
        color:"#f22",
        letterSpacing:1
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 25,
        textAlign:"center",
        color:"#191970"
    },
    modalMessage1: {
        fontSize: 16,
        textAlign:"left",
        color:"#555",
        fontWeight:"500",
    },
    modalMessage2: {
        fontSize: 16,
        textAlign:"left",
        color:"#555",
        marginBottom: 25,
        fontWeight:"500",
    },
    modalMessage3: {
        fontSize: 16,
        textAlign:"left",
        color:"#4682B4"
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
        borderWidth:2,
        borderColor:"#555"
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
        borderWidth:2,
        borderColor:"#f22"
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default PurchaseList;


