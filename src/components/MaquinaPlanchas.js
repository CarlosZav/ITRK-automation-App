import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import Constants from "expo-constants";

const SERVER_URL = __DEV__
  ? 'http://192.168.0.101' // Cambia a tu IP local 192.168.0.101
  : 'http://192.168.0.101:5000'; // Cambia a una IP fija o dominio público

const MaquinaPlanchasScreen = ({ navigation }) => {
 
  const [setCiclos, setearCiclos] = useState('');
  const [setTiempoElevado, setearTiempoElevado] = useState('');
  const [setTiempoBajo, setearTiempoBajo] = useState('');

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  //Timer
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
        forceNew: true,
        reconnection: true,
      });
    
      newSocket.on('connect', () => {
        console.log('Connected to Python server', SERVER_URL);
        Alert.alert('Connection', `Connected to server at ${SERVER_URL}.`);
      });
    
      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        Alert.alert('Connection Error', `Unable to connect to server at ${SERVER_URL}.`);
      });
    
      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    
      setSocket(newSocket);
    
      return () => newSocket.disconnect();
    }, []);
    
  // Mandar datos de seteo de ciclos al presionar el boton iniciar prueba
  const sendMessage = () => {
    const datos = {
      setCiclos: setCiclos,
      setTiempoElevado: setTiempoElevado*1000,
      setTiempoBajo: setTiempoBajo*1000,
      pausar : 'NO'
    };
    socket.emit('datosFromPlanchas', datos);
  };

  const sendMessage_pausar = () => {
    const datos = {
      pausar: 'SI',
    };
    socket.emit('datosFromPlanchasPausar', datos);
  };

  const sendMessage_reanudar = () => {
    const datos = {
      pausar: 'NO',
    };
    socket.emit('datosFromPlanchasPausar', datos);
  };

  const recibirDatos = () => {
    // Eliminar cualquier listener existente para evitar duplicados
    socket.off('datosServerPlanchas');
  
    // Registrar un nuevo listener
    socket.on('datosServerPlanchas', (data) => {
      // Validar que data no sea nulo, indefinido ni vacío
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
  
        let conteoCiclosPlanchas = data.conteoCiclosPlanchas;
        let estadoPruebaPlanchas = data.estadoPruebaPlanchas;
        let tiempoTranscurridoPlanchas = (data.tiempoTranscurridoPlanchas) / 60;
        let seteoCiclosPlanchas = data.setCiclosPlanchas;
  
        console.log('Ciclos transcurridos: ', conteoCiclosPlanchas);
        console.log('Estado de la prueba: ', estadoPruebaPlanchas);
        console.log('Tiempo transcurrido (min): ', tiempoTranscurridoPlanchas);
  
        Alert.alert(
          'Datos recibidos',
          `Ciclos transcurridos: ${conteoCiclosPlanchas}\n
          Estado de la prueba: ${estadoPruebaPlanchas}\n
          Tiempo transcurrido (min): ${tiempoTranscurridoPlanchas}\n
          Ciclos establecidos: ${seteoCiclosPlanchas}`
        );
      } else {
        Alert.alert('Advertencia', 'No se recibieron datos válidos del servidor.');
      }
    });
  
    // Emitir solicitud al servidor
    socket.emit('recibirDatosServerPlanchas');
  };

  // Función para resetear valores
  const resetValues = () => {
    
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };
 
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Planchas')} // Navegar a la pantalla de ayuda
      >
        <Icon name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/Maquina3.png')}
        style={styles.image}
      />
            <Text style={styles.title}>CANTIDAD DE CICLOS</Text>
            <TextInput
              style={styles.input}
              value={setCiclos}
              onChangeText={setearCiclos}
              keyboardType="numeric"
              placeholder="Ingrese ciclos"
            />

            <Text style={styles.title}>TIEMPO ELEVADO</Text>
            <TextInput
              style={styles.input}
              value={setTiempoElevado}
              onChangeText={setearTiempoElevado}
              keyboardType="numeric"
              placeholder="Ingrese tiempo en segundos"
            />

            <Text style={styles.title}>TIEMPO BAJO</Text>
            <TextInput
              style={styles.input}
              value={setTiempoBajo}
              onChangeText={setearTiempoBajo}
              keyboardType="numeric"
              placeholder="Ingrese tiempo en segundos"
            />
      
      <View style={styles.buttonContainer}>
        <Button title="Iniciar nueva prueba" color="#FFD700" onPress={sendMessage} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Visualizar Datos" color="#FFD700" onPress={recibirDatos} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Pausar prueba" color="#FFD700" onPress={sendMessage_pausar} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Reanudar prueba" color="#FFD700" onPress={sendMessage_reanudar} />
      </View> 
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginTop: 50,
    marginBotton: 100,
    alignSelf: 'center',
  },

  helpIcon: {
    position: 'absolute',
    top: 10, // Ajusta según tu diseño
    right: 20, // Ajusta según tu diseño
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  
  selectedValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  

  buttonContainer: {
  width: '60%', // percentage of parent width
  alignSelf: 'center',
  marginTop: 10,
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
});
 
export default MaquinaPlanchasScreen;