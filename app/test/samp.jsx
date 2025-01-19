import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator , Dimensions} from 'react-native';

const PayPalWebView = ({ amount, transactionDetails, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(true);
  const { width, height } = Dimensions.get('window');

  const itemName = `${transactionDetails.route}-${transactionDetails.scheduleDay}-${transactionDetails.scheduleTime}-Seat:${transactionDetails.seatNumber}`;
  const paypalUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=sb-rrmp333452572@business.example.com&item_name=${encodeURIComponent(itemName)}&amount=${amount}&currency_code=USD&return=https://upbeat-antelope-mhfwsd.mystrikingly.com/payment-success&cancel_return=https://example.com/payment-cancel&item_number=${encodeURIComponent(transactionDetails.scheduleId)}`;

  return (
    <View style={{ width: width * 0.9, height: height * 0.785, alignSelf: 'center', borderRadius: 10, overflow: 'hidden' }}>
      {loading && <ActivityIndicator size="large" />}
      <WebView
        source={{ uri: paypalUrl }}
        onLoad={() => setLoading(false)}
        onNavigationStateChange={(event) => {
          if (event.url.startsWith("https://upbeat-antelope-mhfwsd.mystrikingly.com/payment-success")) {
            const urlParams = new URLSearchParams(event.url.split('?')[1]);
            const payerId = urlParams.get('PayerID');

            if (payerId) {
              console.log("Payment Successful with Payer ID:", payerId);
              onPaymentSuccess(payerId); // Call the payment success handler
            }
          } else if (event.url.includes("payment-cancel")) {
            console.log("Payment Cancelled");
          }
        }}
      />
    </View>
  );
};

export default PayPalWebView;
