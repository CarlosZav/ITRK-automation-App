import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/HomeScreen';
import MaquinaCalentamientoScreen from './src/components/MaquinaCalentamiento';
import MaquinaFlexionesScreen from './src/components/MaquinaFlexiones';
import MaquinaPlanchasScreen from './src/components/MaquinaPlanchas';
import MaquinaSecadorasScreen from './src/components/MaquinaSecadoras';
import MaquinaSecadorasFlexionesScreen from './src/components/MaquinaSecadoraFlexiones';
import MaquinaSecadorasRotacionesScreen from './src/components/MaquinaSecadorasRotaciones';
import ConfigScreen from './src/components/ConfigScreen';
import HelpFlexionesScreen from './src/components/HelpFlexionesScreen';
import HelpCalentamientoScreen from './src/components/HelpCalentamientoScreen';
import HelpPlanchasScreen from './src/components/HelpPlanchasScreen';
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
        <Stack.Screen name="Maquina calentamiento" component={MaquinaCalentamientoScreen} />
        <Stack.Screen name="Maquina Flexiones" component={MaquinaFlexionesScreen} />
        <Stack.Screen name="Maquina Planchas" component={MaquinaPlanchasScreen} />
        <Stack.Screen name="Maquina Secadoras" component={MaquinaSecadorasScreen} />
        <Stack.Screen name="Maquina Secadoras Flexiones" component={MaquinaSecadorasFlexionesScreen} />
        <Stack.Screen name="Maquina Secadoras Rotaciones" component={MaquinaSecadorasRotacionesScreen} />
        <Stack.Screen name="Con" component={ConfigScreen} />
        <Stack.Screen name="Ayuda Maquina Flexiones" component={HelpFlexionesScreen} />
        <Stack.Screen name="Ayuda Maquina Calentamiento" component={HelpCalentamientoScreen} />
        <Stack.Screen name="Ayuda Maquina Planchas" component={HelpPlanchasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;