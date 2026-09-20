import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { io } from "socket.io-client";
import Slider from '@react-native-community/slider';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SERVER_URL = 'http://192.168.0.101:5000'; // 192.168.0.101

const CalibracionLavadorasScreen = ({ navigation }) => {
  const [gradosCalibrar, setGradosCalibrar] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');
  const [conexionEspLavadoras, setConexionEspLavadoras] = useState('');

  const [buttonEnabled, setButtonEnabled] = useState(false); // Initially disabled

  const [accionPiston1, setAccionPiston1] = useState('apagar1');
  const [accionPiston2, setAccionPiston2] = useState('apagar2');

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

      const datos = {
        mensaje: 'conexionSatisfactoriaLavadoras',
      };

      newSocket.emit('conexionAppLavadoras', datos);
    });

    newSocket.on('message', (msg) => {
      console.log('Message from server:', msg);
      setMessage(msg);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('calibracionConfirmacionLavadorasApp', (data) => {
      console.log('confirmacion de punto establecido');
      alert('Calibración correcta');
    });

    newSocket.on('conexionAppLavadoras', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConexionEspSecadorasRotacion(data.habilitar); // Store in state
        console.log('Dato habilitar:', data.habilitar); // Log the value directly
        if (data.habilitar === "True") {
          setButtonEnabled(true); // Now it will work
        } else {
          setButtonEnabled(false); // Now it will work
        }
      }
    });

    // Se lee el mensaje de conexion
    newSocket.on('eventoConexionEspSecadorasRot', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConexionEspSecadorasRotacion(data.habilitar); // Store in state
        console.log('Dato habilitar:', data.habilitar); // Log the value directly
        if (data.habilitar === "True") {
          setButtonEnabled(true); // Now it will work
        } else {
          setButtonEnabled(false); // Now it will work
        }
      }
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
    socket.emit('datosfromCalibrarLavadoras', datos);
  };

  const sendMessageCalibrarHorario = () => {
    const datos = {
      gradosCalibrar: gradosCalibrar,
      sentido: 'Horario',
    };
    socket.emit('datosfromCalibrarLavadoras', datos);
  };

  const sendMessageEstablecerCero = () => {
    const datos = {
      gradosCalibrar: 0,
      sentido: 'EstablecerCero',
    };
    socket.emit('datosfromCalibrarLavadoras', datos);
  };

  const sendMessageEstablecerFinal = () => {
    const datos = {
      gradosCalibrar: 0,
      sentido: 'EstablecerFinal',
    };
    socket.emit('datosfromCalibrarLavadoras', datos);
  };

  const sendMessageVentosaLavadoras = () => {
    const datos = {
      gradosCalibrar: 0,
      sentido: 'ventosa',
    };
    socket.emit('datosfromCalibrarLavadoras', datos);
  };

  const sendMessagePiston1 = () => {

    if (accionPiston1 === "prender1") {
      setAccionPiston1('apagar1');
    } else{
      setAccionPiston1 ('prender1')
    }

    const datos = {
      gradosCalibrar: 0,
      sentido: accionPiston1,
    };
    socket.emit('datosfromCalibrarLavadoras', datos);
  };

  const sendMessagePiston2 = () => {
    if (accionPiston2 === "prender2") {
      setAccionPiston2('apagar2')
    } else{
      setAccionPiston2('prender2')
    }
    const datos = {
      gradosCalibrar: 0,
      sentido: accionPiston2,
    };
    socket.emit('datosfromCalibrarLavadoras', datos);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <MaterialCommunityIcons name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>

      <Text style={styles.title}>CALIBRAR FUNCIÓN ABRE-PUERTAS</Text>
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
          <MaterialCommunityIcons name="cog-counterclockwise" size={40} color="#FFD700" />
        </TouchableOpacity>

        {/* Clockwise Button */}
        <TouchableOpacity style={styles.button} onPress={sendMessageCalibrarHorario}>
          <MaterialCommunityIcons name="cog-clockwise" size={40} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Button to center */}
      <View style={styles.centerButtonContainer}>
        <Button title="Establecer punto inicial" 
          color="#FFD700"
          /*disabled={!buttonEnabled} */
          onPress={sendMessageEstablecerCero} />
      </View>

      <View style={styles.centerButtonContainer}>
        <Button title="Establecer punto final" 
          color="#FFD700"
          /*disabled={!buttonEnabled} */
          onPress={sendMessageEstablecerFinal} />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={sendMessageVentosaLavadoras} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Activar/Desactivar Ventosa</Text></TouchableOpacity>
        <TouchableOpacity onPress={sendMessagePiston1} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Activar/Desactivar Piston 1</Text></TouchableOpacity>
        <TouchableOpacity onPress={sendMessagePiston2} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Activar/Desactivar Piston 2</Text></TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginTop: 60,
    marginBottom: 40,
    alignSelf: 'center',
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
    marginTop: 80,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    marginBottom: 50
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Texto en dorado
    marginTop: '100',
    marginBottom: 30,
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
    marginBottom: 20,
  },

  centerButtonContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center', // Centra solo este botón
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },

  subButton: {
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    margin: 10
  },
});

export default CalibracionLavadorasScreen;
