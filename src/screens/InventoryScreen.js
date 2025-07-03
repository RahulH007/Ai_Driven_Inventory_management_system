import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firebase configuration
import Toast from 'react-native-root-toast'; // Import Toast

const InventoryScreen = () => {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');

  // Fetch products from Firebase
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);

      // Show success toast
      Toast.show('Products refreshed!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleExpand = (id) => {
    setExpandedProductId((prevId) => (prevId === id ? null : id));
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditedPrice(product.price.toString());
    setEditedQuantity(product.quantity.toString());
    setIsEditModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedProduct) return;

    try {
      const productRef = doc(db, 'products', selectedProduct.id);
      await updateDoc(productRef, {
        price: parseFloat(editedPrice),
        quantity: parseInt(editedQuantity, 10),
      });

      // Update the local state
      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, price: parseFloat(editedPrice), quantity: parseInt(editedQuantity, 10) }
            : product
        )
      );

      setIsEditModalVisible(false);
      Alert.alert('Success', 'Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update the product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the product from Firestore
              await deleteDoc(doc(db, 'products', id));

              // Update the local state to remove the deleted product
              setProducts((prev) => prev.filter((product) => product.id !== id));

              Alert.alert('Success', 'Product deleted successfully!');
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete the product.');
            }
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => toggleExpand(item.id)}>
        <View style={styles.cardHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <Ionicons
            name={expandedProductId === item.id ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color="#666"
          />
        </View>
      </TouchableOpacity>
      {expandedProductId === item.id && (
        <View style={styles.expandedDetails}>
          <Text style={styles.productDetail}>ID: {item.id}</Text>
          <Text style={styles.productDetail}>Price: ₹{item.price}</Text>
          <Text style={styles.productDetail}>Quantity: {item.quantity}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditProduct(item)}
            >
              <Ionicons name="pencil-outline" size={16} color="#fff" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item.id)}
            >
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Refresh Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <TouchableOpacity onPress={fetchProducts}>
          <Ionicons name="refresh-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Edit Modal */}
      {isEditModalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isEditModalVisible}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Product</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Price"
                keyboardType="numeric"
                value={editedPrice}
                onChangeText={setEditedPrice}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Quantity"
                keyboardType="numeric"
                value={editedQuantity}
                onChangeText={setEditedQuantity}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expandedDetails: {
    marginTop: 10,
  },
  productDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
});