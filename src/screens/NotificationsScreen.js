import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const NotificationsScreen = () => {
  const [language, setLanguage] = useState('english');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Notifications</Text>

        {/* Better Picker */}
        <View style={styles.pickerBox}>
          <Text style={styles.pickerLabel}>Language</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={language}
              onValueChange={(value) => setLanguage(value)}
              style={styles.picker}
              dropdownIconColor="#333"
            >
              <Picker.Item label="English" value="english" />
              <Picker.Item label="हिंदी" value="hindi" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Notification Message */}
      <View style={styles.notificationCard}>
        <Text style={styles.notificationText}>
          {language === 'english' ? (
            <>
              <Text style={styles.alert}>Alert:</Text> Only 2 units of{' '}
              <Text style={styles.productName}>Test Product</Text> remaining in stock. Please restock soon to avoid disruption.
            </>
          ) : (
            <>
              <Text style={styles.alert}>चेतावनी:</Text>{' '}
              <Text style={styles.productName}>टेस्ट प्रोडक्ट</Text> का स्टॉक केवल 2 यूनिट बचा है। कृपया रिस्टॉक करने पर विचार करें।
            </>
          )}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  pickerBox: {
    alignItems: 'flex-end',
  },
  pickerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    width: 150,
    height: 44,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 4,
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 44 : 44,
    color: '#333',
    fontSize: 16,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff3f3',
    borderColor: '#ff4d4d',
    borderWidth: 1,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  alert: {
    fontWeight: 'bold',
    color: '#d60000',
  },
  productName: {
    fontWeight: 'bold',
    color: '#c00',
  },
});

export default NotificationsScreen;
