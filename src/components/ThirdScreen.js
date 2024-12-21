import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from "socket.io-client";

const URL = "http://192.168.137.90:5000";  // Cambia esto con la IP de tu Raspberry
//const ServerURL = "192.168.137.19";
 
const ThirdScreen = ({ navigation }) => {
 
  const [ciclosF, setCiclos] = useState('');
  const [angulo1, setAngulo1] = useState('');
  const [angulo2, setAngulo2] = useState(''); 

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

  // Load the IP address from AsyncStorage
  useEffect(() => {
    const loadIpAddress = async () => {
      try {
        const savedIpAddress = await AsyncStorage.getItem('ServerURL');
        if (savedIpAddress) {
          setIpAddress(savedIpAddress);
          initializeSocket(savedIpAddress);
        }
      } catch (error) {
        console.error("Error loading IP address:", error);
      }
    };

    loadIpAddress();
  }, []);

  const initializeSocket = (ip) => {
    const serverURL  = `http://${ip}:5000`;
    const newSocket = io(URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to Python server', serverURL);
      Alert.alert('Connection', 'Connected to Python server.\nIp: ' + serverURL  + '.');
    });

    newSocket.on('message', (msg) => {
      console.log('Message from server:', msg);
      setMessage(msg);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);
  };

  // Mandar datos de seteo de ciclos al presionar el boton iniciar prueba
  const sendMessage = () => {
    const datos = {
      seteo_ciclosF: ciclosF,
      seteo_anguloA: angulo1,
      seteo_anguloB: angulo2,
      pausar : 'NO'
    };
    socket.emit('datosfromFlexiones', datos);
  };

  const sendMessage_pausar = () => {
    const datos = {
      pausarF: 'SI',
    };
    socket.emit('datosfromFlexiones_pausar', datos);
  };

  const sendMessage_reiniciar = () => {
    const datos = {
      pausarF: 'NO',
    };
    socket.emit('datosfromFlexiones_pausar', datos);
  };

  const recibirDatos = () => {
    socket.emit('recibirDatosServerFlexiones');
    socket.on('datosServidorFlexiones', (data) => {
      // Validar que data no sea nulo, indefinido ni vacío
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      console.log('Datos recibidos:', data);

      let conteo_ciclosFlex = data.conteo_ciclosF;
      let estado_pruebaFlex = data.estado_pruebaF;
      let tiempo_transcurridoFlex = (data.tiempo_transcurridoF)/(1000*60);

      console.log('Ciclos transcurridos: ', conteo_ciclosFlex);
      console.log('Estado de la prueba: ', estado_pruebaFlex);
      console.log('tiempo transcurrido (minutos): ', tiempo_transcurridoFlex);

      Alert.alert('Datos recibidos', JSON.stringify(data, null, 2));
      } else {
        Alert.alert('Advertencia', 'No se recibieron datos válidos del servidor.');
      }
    });

    socket.on('error', (mensaje) => {
      Alert.alert('Error', mensaje);
    });
  };  

  // Función para resetear valores
  const resetValues = () => {
    
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };
 
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Maquina2.png')}
        style={styles.image}
      />
            <Text style={styles.title}>CANTIDAD DE CICLOS</Text>
            <TextInput
              style={styles.input}
              value={ciclosF}
              onChangeText={setCiclos}
              keyboardType="numeric"
              placeholder="Ingrese ciclos"
            />

            <Text style={styles.title}>ÁNGULO DE GIRO 1</Text>
            <TextInput
              style={styles.input}
              value={angulo1}
              onChangeText={setAngulo1}
              keyboardType="numeric"
              placeholder="Ingrese angulo 1"
            />

            <Text style={styles.title}>ÁNGULO DE GIRO 2</Text>
            <TextInput
              style={styles.input}
              value={angulo2}
              onChangeText={setAngulo2}
              keyboardType="numeric"
              placeholder="Ingrese angulo 2"
            />
      
      <View style={styles.buttonContainer}>
        <Button title="Iniciar prueba" color="#FFD700" onPress={sendMessage} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Visualizar Datos" color="#FFD700" onPress={recibirDatos} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Pausar prueba" color="#FFD700" onPress={sendMessage_pausar} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Reiniciar prueba" color="#FFD700" onPress={sendMessage_reiniciar} />
      </View> 
    </View>
  );
};
 
const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginLeft: 110,
    marginTop: -50,
    marginBotton: 100,
    alignItems: 'center',
  },
 
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
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
 
export default ThirdScreen;