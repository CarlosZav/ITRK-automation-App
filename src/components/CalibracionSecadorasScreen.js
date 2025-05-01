import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { io } from "socket.io-client";
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos

const SERVER_URL = 'http://192.168.0.101:5000'; // 192.168.0.101

const CalibracionSecadorasScreen = ({ navigation }) => {
  const [gradosCalibrar, setGradosCalibrar] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    let timer;
    if (elapsedTime > 0) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [elapsedTime]);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to Python server', SERVER_URL);
      Alert.alert('Connection', 'Connected to Python server.\nIp: ' + SERVER_URL + '.');
    });

    newSocket.on('message', (msg) => {
      console.log('Message from server:', msg);
      setMessage(msg);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessageCalibrarAntihorario = () => {
    const datos = {
      gradosCalibrar: gradosCalibrar,
      sentido: 'Antihorario',
    };
    socket.emit('datosfromCalibrarSecadoras', datos);
  };

  const sendMessageCalibrarHorario = () => {
    const datos = {
      gradosCalibrar: gradosCalibrar,
      sentido: 'Horario',
    };
    socket.emit('datosfromCalibrarSecadoras', datos);
  };

  const sendMessageEstablecerCero = () => {
    const datos = {
      gradosCalibrar: 0,
      sentido: 'EstablcerCero',
    };
    socket.emit('datosfromCalibrarSecadoras', datos);
  };

  const recibirDatos = () => {
    socket.off('datosServidorCalibrarSecadoras');
  
    socket.on('datosServidorCalibrarSecadoras', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        let estadoCalibracion = data.estadoCalibracion;
  
        console.log('estado de la calibracion', estadoCalibracion);
  
        Alert.alert(
          'Datos recibidos',
          `Estado de la calibracion: ${estadoCalibracion}`
        );
      } else {
        Alert.alert('Advertencia', 'No se recibieron datos válidos del servidor.');
      }
    });
  
    socket.emit('recibirDatosServidorCalibracionSecadoras');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <Icon name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>

      <Image source={require('../../assets/Maquina2.png')} style={styles.image} />
      <Text style={styles.title}>AJUSTE DE GRADOS</Text>
      <TextInput
        style={styles.input}
        value={gradosCalibrar}
        onChangeText={setGradosCalibrar}
        keyboardType="numeric"
        placeholder="Ingrese el número de grados que desea"
      />

      <View style={styles.container2}>
        {/* Counterclockwise Button */}
        <TouchableOpacity style={styles.button} onPress={sendMessageCalibrarAntihorario}>
          <Icon name="cog-counterclockwise" size={40} color="#FFD700" />
        </TouchableOpacity>

        {/* Clockwise Button */}
        <TouchableOpacity style={styles.button} onPress={sendMessageCalibrarHorario}>
          <Icon name="cog-clockwise" size={40} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Button to center */}
      <View style={styles.centerButtonContainer}>
        <Button title="Establecer cero" color="#FFD700" onPress={sendMessageEstablecerCero} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginLeft: 150,
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },

  helpIcon: {
    position: 'absolute',
    top: 10, // Ajusta según tu diseño
    right: 20, // Ajusta según tu diseño
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Texto en dorado
    marginTop: '60',
    marginBottom: 10,
  },

  input: {
    height: 40,
    borderColor: '#FFD700', // Amarillo
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },

  container2: {
    flexDirection: 'row', // Places items in a row
    justifyContent: 'space-between', // Space between buttons
    paddingHorizontal: 100, // Padding on both sides
    marginTop: 20,
  },

  button: {
    backgroundColor: '#FFFFFF', // Fondo blanco
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD', // Borde gris claro
    width: 80, // Ancho fijo para los botones
    alignItems: 'center', // Centrar el contenido
  },

  centerButtonContainer: {
    marginTop: 50,
    marginBottom: 10,
    alignItems: 'center', // Centra solo este botón
  },
});

export default CalibracionSecadorasScreen;
