import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScannerScreen from '../screens/ScannerScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ChatScreen from '../screens/ChatScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { Ionicons } from '@expo/vector-icons'; // Icons for tab bar

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Scanner') iconName = 'barcode-outline';
          else if (route.name === 'Inventory') iconName = 'cube-outline';
          else if (route.name === 'Chat') iconName = 'chatbubbles-outline';
          else if (route.name === 'Notifications') iconName = 'notifications-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen
        name="Chat"
        component={ChatScreen} // Disable default header for ChatScreen
      />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
