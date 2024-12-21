import React from 'react';
import { View, TouchableOpacity, Text, Button, StyleSheet, SafeAreaView, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
    {/* Banner */}
    <View style={styles.banner}>
        <Image
          style={styles.bannerImage}
          source={require('./Intertek_Logo.png')}  // Cambia la URL por tu imagen
        />
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Second')}>
          <Image style={styles.icon} source={require('../../assets/Maquina.png')} />
          <Text style={styles.menuText}>MAQUINA 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Third')}>
          <Image style={styles.icon} source={require('../../assets/Maquina2.png')} />
          <Text style={styles.menuText}>MAQUINA 2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Fourth')}>
          <Image style={styles.icon} source={require('../../assets/Maquina3.png')} />
          <Text style={styles.menuText}>MAQUINA 3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Fifth')}>
          <Image style={styles.icon} source={require('../../assets/Maquina4.png')} />
          <Text style={styles.menuText}>MAQUINA 4</Text>
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
 /* image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },*/
  banner: {
    backgroundColor: '#FFD700', // Detalle amarillo
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    //width: '60%',
    //height: 80, // Ajusta el tamaño del banner
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
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

export default HomeScreen;