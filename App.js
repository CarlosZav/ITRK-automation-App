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
import CalibracionSecadorasScreen from './src/components/CalibracionSecadorasScreen';
import MaquinaClavijasScreen from './src/components/MaquinaClavijas';
import ConfigScreen from './src/components/ConfigScreen';
import HelpFlexionesScreen from './src/components/HelpFlexionesScreen';
import HelpCalentamientoScreen from './src/components/HelpCalentamientoScreen';
import HelpPlanchasScreen from './src/components/HelpPlanchasScreen';
import MaquinaLavadorasCiclos from './src/components/MaquinaLavadorasCiclos';
import MaquinaLavadorasFuerzaScreen from './src/components/MaquinaLavadorasFuerza.js';
import MaquinaLavadorasScreen from './src/components/MaquinaLavadoras.js';
import CalibracionLavadorasScreen from './src/components/MaquinaLavadorasCalibracion.js';
import MaquinaHornosCiclos from './src/components/MaquinaMicroondas.js';
import TemperaturaScreen from './src/components/Temperatura.js';


import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Iconos de configuración
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('Home')}>
              <MaterialCommunityIcons name="home-lightbulb-outline" size={35} color="#FFD700" />
            </TouchableOpacity>
          ),
        })}>
        
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Temperatura Screen" component={TemperaturaScreen} />
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
        <Stack.Screen name="Calibracion Maquina Secadoras" component={CalibracionSecadorasScreen} />
        <Stack.Screen name="Maquina Clavijas" component={MaquinaClavijasScreen} />
        <Stack.Screen name="Maquina Lavadoras" component={MaquinaLavadorasScreen} />
        <Stack.Screen name="Maquina Lavadoras Ciclos" component={MaquinaLavadorasCiclos} />
        <Stack.Screen name="Maquina Lavadoras Fuerza" component={MaquinaLavadorasFuerzaScreen} />
        <Stack.Screen name="Maquina Lavadoras Calibracion" component={CalibracionLavadorasScreen} />
        <Stack.Screen name="Maquina Microondas" component={MaquinaHornosCiclos} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;