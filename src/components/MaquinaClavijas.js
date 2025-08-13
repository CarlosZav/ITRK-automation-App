import React, { useState, useEffect } from 'react';
import { View, VirtualizedList, StatusBar, Text, Button, Modal, StyleSheet, Image, Alert , TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import DropDownPicker from 'react-native-dropdown-picker';

const SERVER_URL = 'http://192.168.0.101:5000';  // IPG CON SERVIDOR INTERTEK 192.168.0.101
//const ServerURL = "192.168.137.19";

const InfoCard = ({ title, value }) => (
  <View style={styles.cardWrapper}>
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const MaquinaClavijasScreen = ({ navigation }) => {

  //Label
  const [ciclosC, setciclosC] = useState('');
  const [milliOnC, setmilliOnC] = useState('');
  const [milliOffC, setmilliOffC] = useState('');
  //Clock
  const [elapsedTimeC, setelapsedTimeC] = useState(0); // in seconds
  //Comunicación WS Envío
  const [socketC, setsocketC] = useState(null);
  const [messageC, setMessageC] = useState("");
  const [ipAddressC, setIpAddressC] = useState('');

  //Modal
  const [modalVisibleC, setModalVisibleC] = useState(false);

  const [sensorValueC, setSensorValueC] = useState(0);
  const [conteociclosC, setConteociclosC] = useState(0);
  const [estadoSSRC, setEstadoSSRC] = useState("false");
  const [tiempoTranscurridoC, setTiempoTranscurridoC] = useState(0);

  //Timer
  useEffect(() => {
    let timer;
    if (elapsedTimeC > 0) {
      timer = setInterval(() => {
        setelapsedTimeC(prev => prev + 1);
      }, 1000);
    }
  
    return () => clearInterval(timer);
  }, [elapsedTimeC]);

  // Load the IP address from AsyncStorage
  useEffect(() => {
    const loadIpAddress = async () => {
      try {
        const savedIpAddress = await AsyncStorage.getItem('ServerURL');
        if (savedIpAddress) {
          setIpAddressC(savedIpAddress);
          initializesocketC(savedIpAddress);
        }
      } catch (error) {
        console.error("Error loading IP address:", error);
      }
    };

    loadIpAddress();
  }, []);

  useEffect(() => {
      // Inicializa la conexión con el servidor
      const newsocketC = io(SERVER_URL, {
        transports: ['websocket'],
      });
  
      newsocketC.on('connect', () => {
        console.log('Connected to Python server', SERVER_URL);
        Alert.alert('Connection', 'Connected to Python server.\nIp: ' + SERVER_URL  + '.');
      });
  
      newsocketC.on('messageC', (msg) => {
        console.log('Message from server:', msg);
        setMessageC(msg);
      });

      // Aquí agregas la escucha directa a 'datosServidor'
      newsocketC.on('datosServidorC', (data) => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          console.log('Datos recibidos:', data);
          setSensorValueC(data.sensorValueC);
          setConteociclosC(data.conteo_ciclosC);
          setEstadoSSRC(data.estadoSsrC);
          setTiempoTranscurridoC(parseFloat((data.tiempoTranscurridoC / 60000).toFixed(4)));
        }
      });
  
      newsocketC.on('disconnect', () => {
        console.log('Disconnected from server');
      });
  
      setsocketC(newsocketC);
  
      // Limpia la conexión al desmontar el componente
      return () => {
        newsocketC.disconnect();
      };
    }, []);

  const sendMessage = () => {
    //Milisengundos en ON y OFF
    let mili_ON = milliOnC * 60 * 1000; 
    let mili_OFF = milliOffC * 60 * 1000; 

    print('tiempo on : ', mili_ON);
    print('tiempo off : ', mili_OFF);

    const datos = {
      seteoCiclosC: ciclosC,
      setTiempoEncendidoC: mili_ON,
      setTiempoApagadoC: mili_OFF,
    };
    socketC.emit('datosfromAppC', datos);
  };

  const recibirDatos = () => {
    socketC.emit('recibirDatosServerC');
    socketC.on('datosServidorC', (data) => {
      // Validar que data no sea nulo, indefinido ni vacío
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      console.log('Datos recibidos:', data);

      let sensor_valueJS = data.sensorValueC;
      let conteo_ciclosCJS = data.conteoCiclosC;
      let estado_ssrJS = data.estadoSsrC;
      let tiempo_transcurridoJS = data.tiempoTranscurridoC;

      console.log('valor de sensor: ', sensor_valueJS);
      console.log('conteo ciclosC: ', conteo_ciclosCJS);
      console.log('estado ssr: ', estado_ssrJS);
      console.log('tiempo transcurrido: ', tiempo_transcurridoJS);

      Alert.alert('Datos recibidos', JSON.stringify(data, null, 2));
      } else {
        Alert.alert('Advertencia', 'No se recibieron datos válidos del servidor.');
      }
    });
    
    socketC.on('error', (mensaje) => {
      Alert.alert('Error', mensaje);
    });
  };  

  // Función para resetear valores
  const resetValues = () => {
    setDay('00');
    setHour('00');
    setMinute('00');
    setSecond('00');

    setDay2('00');
    setHour2('00');
    setMinute2('00');
    setSecond2('00');

    setciclosC('1');
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.image_container}>
        <Image
          source={require('../../assets/Maquina.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.containerCards}>
        <InfoCard title="Corriente (A)" value= {sensorValueC.toString()} />
        <InfoCard title="Estado" value={estadoSSRC.toString()} />
        <InfoCard title="ciclosC transcurridos" value={conteociclosC.toString()} />
        <InfoCard title="Tiempo de estado (min)" value={tiempoTranscurridoC.toString()} />
      </View>
     
      <TouchableOpacity
              style={styles.helpIcon}
              onPress={() => navigation.navigate('Ayuda Maquina Calentamiento')} // Navegar a la pantalla de ayuda
            >
              <Icon name="robot-confused" size={30} color="#FFD700" />
            </TouchableOpacity>

            <Text style={styles.title}>TIEMPO ENCENDIDO</Text>
            <TextInput
              style={styles.input}
              value={milliOnC}
              onChangeText={setmilliOnC}
              keyboardType="numeric"
              placeholder="Ingrese tiempo encendido en minutos"
            />

            <Text style={styles.title}>TIEMPO APAGADO</Text>
            <TextInput
              style={styles.input}
              value={milliOffC}
              onChangeText={setmilliOffC}
              keyboardType="numeric"
              placeholder="Ingrese tiempo apagado en min"
            />
      
            <Text style={styles.title}>CANTIDAD DE ciclosC</Text>
            <TextInput
              style={styles.input}
              value={ciclosC}
              onChangeText={setciclosC}
              keyboardType="numeric"
              placeholder="Ingrese ciclosC"
            />
      
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Enviar Datos" color="#FFD700" onPress={sendMessage} />
        </View>
        <View style={styles.button}>
          <Button title="Recibir Datos" color="#FFD700" onPress={recibirDatos} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Resetear Valores" color="#FF6347" onPress={resetValues} />
        </View>
        <View style={styles.button}>
          <Button title="Pausar ciclo" color="#FF6347" onPress={resetValues} />
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
});
 
export default MaquinaClavijasScreen;