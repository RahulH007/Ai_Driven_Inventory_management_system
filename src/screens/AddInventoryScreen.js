// 📁 src/screens/AddInventoryScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { useNavigation } from '@react-navigation/native'; // For navigation
import { db } from '../firebaseConfig'; // Import Firestore configuration
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods

const AddInventoryScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [productId, setProductId] = useState('');

  const handleAddProduct = async () => {
    if (!productId || !productName || !quantity || !price) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const entryDate = new Date().toISOString(); // Get the current date in ISO format

      // Add product to Firestore
      await setDoc(doc(db, 'products', productId), {
        barcode_id: productId,
        entry_date: entryDate,
        name: productName,
        price: parseFloat(price), // Convert price to a number
        quantity: parseInt(quantity, 10), // Convert quantity to a number
      });

      Alert.alert('Success', 'Product added to inventory!');
      // Clear the input fields
      setProductId('');
      setProductName('');
      setQuantity('');
      setPrice('');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product to inventory.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.heading}>Add to Inventory</Text>

      <TouchableOpacity style={styles.scanButton} onPress={() => console.log('Scan Product button clicked')}>
        <Ionicons name="barcode-outline" size={24} color="#fff" />
        <Text style={styles.scanButtonText}>Scan Product</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Ionicons name="id-card-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Product ID"
          value={productId}
          onChangeText={setProductId}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="cube-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="cash-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddInventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    position: 'absolute',
    top: 60, // Adjusted to align with the header
    left: 20,
    zIndex: 1,
  },
  heading: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginLeft: 40, // Add margin to avoid overlap with the back button
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
