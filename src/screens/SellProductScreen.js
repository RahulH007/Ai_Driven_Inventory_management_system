import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firebase configuration

const SellProductScreen = () => {
  const navigation = useNavigation();

  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [suggestions, setSuggestions] = useState([]); // State for product suggestions
  const [inventory, setInventory] = useState([]); // State for inventory data

  // Fetch inventory from Firebase
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventory(productList);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleScanProduct = () => {
    console.log('Scan Product button clicked');
    setProductName('Sample Product Name');
  };

  const handleSellProduct = async () => {
    if (!productId || !productName || !quantity) {
      alert('Please fill in all fields.');
      return;
    }

    const selectedProduct = inventory.find((product) => product.id === productId);

    if (!selectedProduct) {
      alert('Product not found in inventory.');
      return;
    }

    if (parseInt(quantity) > selectedProduct.quantity) {
      alert('Insufficient stock available.');
      return;
    }

    try {
      // Update the product quantity in Firebase
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        quantity: selectedProduct.quantity - parseInt(quantity),
      });

      alert('Product sold successfully!');
      console.log('Product Sold:', { productId, productName, quantity });

      // Refresh the inventory
      const updatedInventory = inventory.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity - parseInt(quantity) }
          : product
      );
      setInventory(updatedInventory);

      // Clear the input fields
      setProductId('');
      setProductName('');
      setQuantity('');
    } catch (error) {
      console.error('Error selling product:', error);
      alert('Failed to sell the product.');
    }
  };

  const handleProductNameChange = (text) => {
    setProductName(text);

    // Filter inventory for suggestions
    if (text.length > 0) {
      const filteredSuggestions = inventory.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (product) => {
    setProductName(product.name);
    setProductId(product.id); // Optionally set the product ID
    setSuggestions([]); // Clear suggestions
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.heading}>Sell Product</Text>

      <TouchableOpacity style={styles.scanButton} onPress={handleScanProduct}>
        <Ionicons name="barcode-outline" size={24} color="#fff" />
        <Text style={styles.scanButtonText}>Scan Product</Text>
      </TouchableOpacity>

      {/* Product ID Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="id-card-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Product ID"
          value={productId}
          onChangeText={setProductId}
        />
      </View>

      {/* Product Name Input with Suggestions */}
      <View style={styles.inputContainer}>
        <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={productName}
          onChangeText={handleProductNameChange}
        />
      </View>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSuggestionSelect(item)}
            >
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      {/* Quantity Input */}
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

      <TouchableOpacity style={styles.sellButton} onPress={handleSellProduct}>
        <Ionicons name="cart-outline" size={24} color="#fff" />
        <Text style={styles.sellButtonText}>Sell Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SellProductScreen;

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
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  sellButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
