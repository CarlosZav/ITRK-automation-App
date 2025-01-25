import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Button, StyleSheet, Image, Alert , TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { HeaderStyleInterpolators } from '@react-navigation/stack';
 
const MaquinaSecadorasScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.image_container}>
        <Image
          source={require('../../assets/Maquina4.png')}
          style={styles.image}
        />
      </View>

      {/* Menu Options */}
        <View style={styles.menuContainer}>
      

          <Text style={styles.title} >SELECCIONA LA FUNCIÓN DESEADA</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Secadoras Flexiones')}>
            <Image style={styles.icon} source={require('../../assets/Maquina.png')} />
            <Text style={styles.menuText}>Función Flexiones</Text>
          </TouchableOpacity>
      
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Secadoras Rotaciones')}>
            <Image style={styles.icon} source={require('../../assets/Maquina2.png')} />
            <Text style={styles.menuText}>Función Rotaciones</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
    marginTop: 30,
  },

  headerStyle:{
    headerTintColor: '#FFD700', // Detalle amarillo
  },

  image: {
    width: 100,
    height: 100,
    marginLeft: 50,
    marginTop: 50,
    marginBotton: 100,
    alignItems: 'center',
  },

 /* image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },*/
  menuContainer: {
    flex: 1,
    padding: 20,
    
  },
  menuItem: {
    //backgroundColor: '#fff',
    backgroundColor: '#FFD700', // Detalle amarillo
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