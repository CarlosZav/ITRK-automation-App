import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos


const MaquinaSecadorasScreen = ({ navigation }) => {


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <Icon name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>


      <View style={styles.image_container}>
        <Image
          source={require('../../assets/Maquina2.png')}
          style={styles.image}
        />
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>

        <Text style={styles.title}>SELECCIONA LA FUNCIÓN DESEADA</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Secadoras Flexiones')}>
          <Image style={styles.icon} source={require('../../assets/Maquina.png')} />
          <Text style={styles.menuText}>Función Flexiones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Secadoras Rotaciones')}>
          <Image style={styles.icon} source={require('../../assets/Maquina2.png')} />
          <Text style={styles.menuText}>Función Rotaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Calibracion Maquina Secadoras')}>
          <Image style={styles.icon} source={require('../../assets/Maquina2.png')} />
          <Text style={styles.menuText}>Calibrar Maquina</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Fondo principal blanco
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
    marginTop: 30,
  },

  helpIcon: {
    position: 'absolute',
    top: 10, // Ajusta según tu diseño
    right: 20, // Ajusta según tu diseño
  },
  
  image: {
    width: 100,
    height: 100,
    marginLeft: 50,
    marginTop: 50,
    marginBottom: 10,
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#FFD700', // Fondo amarillo
    borderRadius: 10,
    padding: 15,
    width: 300,
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    width: 45,
    height: 45,
    marginRight: 50,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MaquinaSecadorasScreen;
