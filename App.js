import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import AddInventoryScreen from './src/screens/AddInventoryScreen';
import SellProductScreen from './src/screens/SellProductScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
        <Stack.Screen name="AddInventory" component={AddInventoryScreen} />
        <Stack.Screen name="SellProduct" component={SellProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
