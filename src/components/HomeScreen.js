import React from 'react';
import { View, TouchableOpacity, Text, Button, StyleSheet, SafeAreaView, Image } from 'react-native';
import { ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
    {/* Banner */}
    <View style={styles.banner}>
        <Image
          style={styles.bannerImage}
          source={require('./Intertek_Logo.png')}  // Cambia la URL por tu imagen
        />
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {/*
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Temperatura Screen')}>
          <Image style={styles.icon} source={require('../../assets/Maquina.png')} />
          <Text style={styles.menuText}>Temperatura Horno</Text>
        </TouchableOpacity>*/}

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina calentamiento')}>
          <Image style={styles.icon} source={require('../../assets/Maquina.png')} />
          <Text style={styles.menuText}>Maquina Calenta...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Flexiones')}>
          <Image style={styles.icon} source={require('../../assets/Maquina2.png')} />
          <Text style={styles.menuText}>Maquina Flexiones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Planchas')}>
          <Image style={styles.icon} source={require('../../assets/Maquina3.png')} />
          <Text style={styles.menuText}>Maquina Planchas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Secadoras')}>
          <Image style={styles.icon} source={require('../../assets/Maquina4.png')} />
          <Text style={styles.menuText}>Maquina Secadoras</Text>
        </TouchableOpacity>

        {/*<TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Clavijas')}>
          <Image style={styles.icon} source={require('../../assets/Maquina.png')} />
          <Text style={styles.menuText}>Maquina Clavijas</Text>
        </TouchableOpacity>*/}

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Lavadoras')}>
          <Image style={styles.icon} source={require('../../assets/Maquina.png')} />
          <Text style={styles.menuText}>Maquina Lavadoras</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maquina Microondas')}>
          <Image style={styles.icon} source={require('../../assets/Maquina.png')} />
          <Text style={styles.menuText}>Maquina microondas</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 40, // opcional, para dejar espacio al final
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