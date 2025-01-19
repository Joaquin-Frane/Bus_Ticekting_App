import React from 'react';
import { View, Text } from 'react-native';
import PayPalWebView from './samp';

const PaymentScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Payment Screen</Text>
      <PayPalWebView amount="10.00" />
    </View>
  );
};

export default PaymentScreen;
