import React, { useState, useEffect } from 'react';
import { View, VirtualizedList, StatusBar, Text, Button, Modal, StyleSheet, Image, Alert , TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from "socket.io-client";
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const SERVER_URL = 'http://192.168.0.101:5000';  // IP CON SERVIDOR INTERTEK 192.168.0.101

const InfoCard = ({ title, value }) => (
  <View style={styles.cardWrapper}>
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const MaquinaCalentamientoScreen = ({ navigation }) => {

  //Label
  const [ciclos, setCiclos] = useState('');
  const [milliOn, setMilliOn] = useState('');
  const [milliOff, setMilliOff] = useState('');
  //Clock
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  
  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  //Modal
  const [modalVisible, setModalVisible] = useState(false);

  const [sensorValue, setSensorValue] = useState(0);
  const [conteoCiclos, setConteoCiclos] = useState(0);
  const [estadoSSR, setEstadoSSR] = useState("false");
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);

  const [setCiclosCalentamiento, setSetCiclosCalentamiento] = useState('0')
  const [buttonEnabled, setButtonEnabled] = useState(false); // Initially disabled
  const [conexionEspCalentamiento, setConexionEspCalentamiento] = useState('');

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

  useEffect(() => {
      // Inicializa la conexión con el servidor
      const newSocket = io(SERVER_URL, {
        transports: ['websocket'],
      });
  
      newSocket.on('connect', () => {
        console.log('Connected to Python server', SERVER_URL);
        Alert.alert('Connection', 'Connected to Python server.\nIp: ' + SERVER_URL  + '.');
      });
  
      newSocket.on('message', (msg) => {
        console.log('Message from server:', msg);
        setMessage(msg);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Aquí agregas la escucha directa a 'datosServidor'
      newSocket.on('datosServidor', (data) => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          console.log('Datos recibidos:', data);
          setSensorValue(data.sensor_value);
          setConteoCiclos(data.conteo_ciclos);
          setEstadoSSR(data.estado_ssr);
          setTiempoTranscurrido(parseFloat((data.tiempo_transcurrido / 60000).toFixed(4)));

          /*
          setConexionEspCalentamiento(data.habilitar); // Store in state
          console.log('Dato habilitar:', data.habilitar); // Log the value directly
          if (data.habilitar === "True") {
            setButtonEnabled(true); // Now it will work
          } else {
            setButtonEnabled(false); // Now it will work
          }
          */
        }
      });
  
      /*
      newSocket.on('conexionAppCalentamiento', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConexionEspCalentamiento(data.habilitar); // Store in state
        console.log('Dato habilitar:', data.habilitar); // Log the value directly
        if (data.habilitar === "True") {
          setButtonEnabled(true); // Now it will work
        } else {
          setButtonEnabled(false); // Now it will work
        }
      }
    });
    */
    
    /*
    newSocket.on('eventoConexionEspCalentamiento', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConexionEspCalentamiento(data.habilitar); // Store in state
        console.log('Dato habilitar:', data.habilitar); // Log the value directly
        if (data.habilitar === "True") {
          setButtonEnabled(true); // Now it will work
        } else {
          setButtonEnabled(false); // Now it will work
        }
      }
    });
    */
  
      setSocket(newSocket);
  
      // Limpia la conexión al desmontar el componente
      return () => {
        newSocket.disconnect();
      };
    }, []);

  const sendMessage = () => {
    //Milisengundos en ON y OFF
    let mili_ON = milliOn * 60 * 1000; 
    let mili_OFF = milliOff * 60 * 1000; 

    console.log('tiempo on : ', mili_ON);
    console.log('tiempo off : ', mili_OFF);

    const datos = {
      seteo_ciclos: ciclos,
      seteo_tiempo_encendido: mili_ON,
      seteo_tiempo_apagado: mili_OFF,
    };
    socket.emit('datosfromApp', datos);
  };

  // Función para resetear valores
  const resetValues = () => {

  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

  /*
   // Calculate the fill value for the circular progress
  const fillValueForProgress = setCiclosCalentamiento !== '0' && !isNaN(parseFloat(setCiclosCalentamiento))
    ? (conteoCiclos * 100) / parseFloat(setCiclosCalentamiento)
    : 0;
  */

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.image_container}>
        <Image
          source={require('../../assets/Maquina.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.containerCards}>
        <InfoCard title="Corriente (A)" value={String(sensorValue)} />
        <InfoCard title="Estado" value={String(estadoSSR)} />
        <InfoCard title="Ciclos transcurridos" value={String(conteoCiclos)} />
        <InfoCard title="Tiempo de estado (min)" value={String(tiempoTranscurrido)} />
      </View>

      {/*
      <View style={styles.cardContainerCircular} title="Flexiones">
      
               <Text style={styles.cardTitle}>Progreso de Rotaciones</Text>
              <AnimatedCircularProgress
                size={200}
                width={15}
                fill={fillValueForProgress} // porcentaje de pasos completados
                tintColor="#FFD700"
                backgroundColor="#3d5875"
                duration={1000}
                >
                {(fill) => (
                  <Text style={styles.progressText}>
                    {Math.round((fill * parseFloat(setCiclosCalentamiento)) / 100)} / {Math.round(parseFloat(setCiclosCalentamiento))}
                  </Text>
                )}
              </AnimatedCircularProgress> 
      
            </View> */}
     
      <TouchableOpacity
              style={styles.helpIcon}
              onPress={() => navigation.navigate('Ayuda Maquina Calentamiento')} // Navegar a la pantalla de ayuda
            >
              <MaterialCommunityIcons name="robot-confused" size={30} color="#FFD700" />
            </TouchableOpacity>

            <Text style={styles.title}>TIEMPO ENCENDIDO</Text>
            <TextInput
              style={styles.input}
              value={milliOn}
              onChangeText={setMilliOn}
              keyboardType="numeric"
              placeholder="Ingrese tiempo encendido en minutos"
            />

            <Text style={styles.title}>TIEMPO APAGADO</Text>
            <TextInput
              style={styles.input}
              value={milliOff}
              onChangeText={setMilliOff}
              keyboardType="numeric"
              placeholder="Ingrese tiempo apagado en min"
            />
      
            <Text style={styles.title}>CANTIDAD DE CICLOS</Text>
            <TextInput
              style={styles.input}
              value={ciclos}
              onChangeText={setCiclos}
              keyboardType="numeric"
              placeholder="Ingrese ciclos"
            />
      
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Enviar Datos" 
          color="#FFD700" 
          onPress={sendMessage}
          /*disabled={!buttonEnabled} *//>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Resetear Valores" 
          color="#FF6347" 
          onPress={resetValues}
          /*disabled={!buttonEnabled} *//>
        </View>
        <View style={styles.button}>
          <Button title="Pausar ciclo" 
          color="#FF6347" 
          onPress={resetValues}
          /*disabled={!buttonEnabled} *//>
        </View>
      </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  image_container: {
    flex: 1, // Take the full height and width
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    //backgroundColor: '#fff', // Optional background color
  },
  image: {// Take the full height and width
    width: 100, // Set your desired width
    height: 100, // Set your desired height
  },
  clock: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  helpIcon: {
    position: 'absolute',
    top: 10, // Ajusta según tu diseño
    right: 20, // Ajusta según tu diseño
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Adjusts spacing between buttons
    marginTop: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5, // Adds space between buttons
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

  containerCards: {
    padding: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    flexWrap: 'wrap',       // Permite que pasen a la siguiente línea si no caben
    justifyContent: 'space-between', // Espaciado horizontal uniforme
    paddingHorizontal: 5,
  },

  cardWrapper: {
    width: '48%',
    marginVertical: 8,
  },

  card: {
  backgroundColor: '#FFD700',
  borderRadius: 10,
  padding: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  width: '100%',
  borderColor: '#FFD700', // Contorno amarillo dorado
  },
  title: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    color: '#555',
    marginTop: 4,
  },

  cardContainerCircular: {
    backgroundColor: 'white', // Set the background to white
    borderRadius: 20,        // Optional: Add rounded corners for a softer look
    padding: 20,             // Optional: Add some paddaczaing inside the card
    marginVertical: 10,       // Optional: Add vertical margin to separate cards
    marginHorizontal: 0,     // Optional: Add horizontal margin
    borderColor: '#ccc',       // Set a light gray border color for contrast
    borderWidth: 1,          // Set the border width
    alignItems: 'center',     // Center the content horizontally within the card
    justifyContent: 'center', // Center the content vertically within the card (if needed)
    // Optional: Add shadow for a lifted effect (platform-specific)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10, // Add some space between the title and the progress
    color: '#333', // Optional: Style the title text color
    textAlign: 'left', // Optional: Center the title
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
 
export default MaquinaCalentamientoScreen;