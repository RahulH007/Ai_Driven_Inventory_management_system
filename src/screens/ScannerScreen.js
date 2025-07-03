import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ScannerScreen = ({ navigation }) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
      }}>Scanner Screen</Text>

      <TouchableOpacity 
        style={{
          backgroundColor: '#007bff',
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
          width: 200,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('AddInventory')}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Add to Inventory</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 8,
          width: 200,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('SellProduct')}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Sell Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScannerScreen;
