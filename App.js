import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/HomeScreen';
import SecondScreen from './src/components/SecondScreen';
import ThirdScreen from './src/components/ThirdScreen';
import FourthScreen from './src/components/FourthScreen';
import FifthScreen from './src/components/FifthScreen';
import ConfigScreen from './src/components/ConfigScreen';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Iconos de configuración

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate('Con')}>
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}>
        
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Second" component={SecondScreen} />
        <Stack.Screen name="Third" component={ThirdScreen} />
        <Stack.Screen name="Fourth" component={FourthScreen} />
        <Stack.Screen name="Fifth" component={FifthScreen} />
        <Stack.Screen name="Con" component={ConfigScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;