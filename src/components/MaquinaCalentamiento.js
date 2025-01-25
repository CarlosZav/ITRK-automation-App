import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/Ionicons';

const URL = "http://192.168.0.101:5000";  // IPG CON SERVIDOR INTERTEK 192.168.0.101
//const ServerURL = "192.168.137.19";

const MaquinaCalentamientoScreen = ({ navigation }) => {
  //Picker 1
  const [day, setDay] = useState('00');
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const [second, setSecond] = useState('00');
  //Picker 2
  const [day2, setDay2] = useState('00');
  const [hour2, setHour2] = useState('00');
  const [minute2, setMinute2] = useState('00');
  const [second2, setSecond2] = useState('00');
  //Label
  const [ciclos, setCiclos] = useState('1');
  //Clock
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

  const sendMessage = () => {
    //Milisengundos en ON y OFF
    let mili_ON = (day * 24 * 60 * 60 * 1000) + (hour * 60 * 60 * 1000) + (minute * 60 * 1000) + (second * 1000); 
    let mili_OFF = (day2 * 24 * 60 * 60 * 1000) + (hour2 * 60 * 60 * 1000) + (minute2 * 60 * 1000) + (second2 * 1000); 

    print('tiempo on : ', mili_ON);
    print('tiempo off : ', mili_OFF);

    const datos = {
      seteo_ciclos: ciclos,
      seteo_tiempo_encendido: mili_ON,
      seteo_tiempo_apagado: mili_OFF,
    };
    socket.emit('datosfromApp', datos);
  };

  const recibirDatos = () => {
    socket.emit('recibirDatosServer');
    socket.on('datosServidor', (data) => {
      // Validar que data no sea nulo, indefinido ni vacío
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      console.log('Datos recibidos:', data);

      let sensor_valueJS = data.sensor_value;
      let conteo_ciclosJS = data.conteo_ciclos;
      let estado_ssrJS = data.estado_ssr;
      let tiempo_transcurridoJS = data.tiempo_transcurrido;

      console.log('valor de sensor: ', sensor_valueJS);
      console.log('conteo ciclos: ', conteo_ciclosJS);
      console.log('estado ssr: ', estado_ssrJS);
      console.log('tiempo transcurrido: ', tiempo_transcurridoJS);

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
    setDay('00');
    setHour('00');
    setMinute('00');
    setSecond('00');

    setDay2('00');
    setHour2('00');
    setMinute2('00');
    setSecond2('00');

    setCiclos('1');
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
              style={styles.helpIcon}
              onPress={() => navigation.navigate('Ayuda Maquina Calentamiento')} // Navegar a la pantalla de ayuda
            >
              <Icon name="help-circle-outline" size={30} color="#FFD700" />
            </TouchableOpacity>

      <View style={styles.image_container}>
        <Image
          source={require('../../assets/Maquina.png')}
          style={styles.image}
        />
      </View>

      <Text style={styles.clock}>
        Tiempo transcurrido:  {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
      </Text>

      <Text style={styles.title}>TIEMPO DE ENCENDIDO</Text>
            <View style={styles.pickerRow}>
              {/* Día */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Día</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.selectedValue}>:{day}</Text>
                  <Picker
                    selectedValue={day}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDay(itemValue)}
                  >
                    {[...Array(32).keys()].map((day) => (
                      <Picker.Item key={day} label={(day).toString().padStart(2, '0')} value={day} />
                    ))}
                  </Picker>
                  
                </View>
              </View>

              {/* Hora */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{hour}</Text>
                  <Picker
                    selectedValue={hour}
                    style={styles.picker}
                    onValueChange={(itemValue) => setHour(itemValue)}
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Minuto */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Minuto</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{minute}</Text>
                  <Picker
                    selectedValue={minute}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMinute(itemValue)}
                  >
                    {[...Array(60).keys()].map((minute) => (
                      <Picker.Item key={minute} label={minute.toString().padStart(2, '0')} value={minute} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Segundo */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Segundo</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{second}</Text>
                  <Picker
                    selectedValue={second}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSecond(itemValue)}
                  >
                    {[...Array(60).keys()].map((second) => (
                      <Picker.Item key={second} label={second.toString().padStart(2, '0')} value={second} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
 
            <Text style={styles.title}>TIEMPO DE APAGADO</Text>
            <View style={styles.pickerRow}>
              {/* Día */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Día</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{day2}</Text>
                  <Picker
                    selectedValue={day2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDay2(itemValue)}
                  >
                    {[...Array(32).keys()].map((day) => (
                      <Picker.Item key={day} label={(day).toString().padStart(2, '0')} value={day} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Hora */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{hour2}</Text>
                  <Picker
                    selectedValue={hour2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setHour2(itemValue)}
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Minuto */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Minuto</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{minute2}</Text>
                  <Picker
                    selectedValue={minute2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMinute2(itemValue)}
                  >
                    {[...Array(60).keys()].map((minute) => (
                      <Picker.Item key={minute} label={minute.toString().padStart(2, '0')} value={minute} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Segundo */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Segundo</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{second2}</Text>
                  <Picker
                    selectedValue={second2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSecond2(itemValue)}
                  >
                    {[...Array(60).keys()].map((second) => (
                      <Picker.Item key={second} label={second.toString().padStart(2, '0')} value={second} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
            </View>
      
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
    </View>
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
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    alignItems: 'center',
  },
  pickerLabelContainer: {
    alignItems: 'center',
    width: 80,
  },
  pickerLabel: {
    fontSize: 14,
    marginBottom: 3,
  },
  picker: {
    height: 50,
    width: 35,
    borderWidth: 1,
    textAlign: 'flex-end',
    alignItems: 'flex-end',
    borderColor: '#FFD700', // Amarillo
    borderRadius: 10,
  },
  helpIcon: {
    position: 'absolute',
    top: 10, // Ajusta según tu diseño
    right: 10, // Ajusta según tu diseño
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30
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
});
 
export default MaquinaCalentamientoScreen;