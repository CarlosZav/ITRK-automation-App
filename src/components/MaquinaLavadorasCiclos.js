import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput, TouchableOpacity, Switch} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { io } from "socket.io-client";
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import { ScrollView } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SERVER_URL = 'http://192.168.0.101:5000';

const InfoCard = ({ title, value }) => (
  <View style={styles.cardWrapper}>
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const MaquinaLavadorasCiclos = ({ navigation }) => {

  //PISTON 1
  const [isEnabled1, setIsEnabled1] = useState(false);
  const toggleSwitch1 = () => setIsEnabled1(previousState1=> !previousState1);
  const [tiempoPiston1, setTeimpoPiston1] = useState('0');

  //PISTON 2
  const [isEnabled2, setIsEnabled2] = useState(false);
  const toggleSwitch2 = () => setIsEnabled2(previousState2 => !previousState2);
  const [tiempoPiston2, setTeimpoPiston2] = useState('0');

  //PISTON 3
  const [isEnabled3, setIsEnabled3] = useState(false);
  const toggleSwitch3 = () => setIsEnabled3(previousState3 => !previousState3);
  const [tiempoPiston3, setTeimpoPiston3] = useState('0');

  //PIESTON 4
  const [isEnabled4, setIsEnabled4] = useState(false);
  const toggleSwitch4 = () => setIsEnabled4(previousState4 => !previousState4);
  const [tiempoPiston4, setTeimpoPiston4] = useState('0');

  const [ciclosLavadoras, setCiclosLavadoras] = useState('');
  const [velocidadLavadoras, setVelocidadLavadoras] = useState('');  

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  //CARDS
  const [conteoCiclosLavadoras, setConteoCiclosLavadoras] = useState(0);
  const [estadoLavadoras, setEstadoLavadoras] = useState("Stop");
  const [tiempoLavadoras, setTiempoLavadoras] = useState(0);

  const [setCiclosLavadorasAnimacion, setSetCiclosLavadoras] = useState('0');
  const [setVelocidadLavadorasA, setSetVelocidadLavadoras] = useState('0');
  const [conexionEspSecadorasRotacion, setConexionEspSecadorasRotacion] = useState('');
  
  const [buttonEnabled, setButtonEnabled] = useState(false); // Initially disabled

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
    // Inicializa la conexión con el servidor
    const newSocket = io(SERVER_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to Python server', SERVER_URL);
      Alert.alert('Connection', 'Connected to Python server.\nIp: ' + SERVER_URL  + '.');

      /*const datos = {
        mensaje: 'conexionSatisfactoria',
      };

      newSocket.emit('conexionAppSecadorasRot', datos);*/
    });

    newSocket.on('message', (msg) => {
      console.log('Message from server:', msg);
      setMessage(msg);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Aquí agregas la escucha directa a 'datosServidor'
    newSocket.on('datosServidorLavadoras', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConteoCiclosLavadoras(data.conteoCiclosLavadoras);
        setEstadoLavadoras(data.estadoLavadoras);
        setSetVelocidadLavadoras(data.velocidadLavadoras);
        setSetCiclosLavadoras(data.ciclosLavadoras);
        setTiempoLavadoras(parseFloat((data.tiempoLavadoras / 60).toFixed(4)));
        
        /*
        setConexionEspSecadorasRotacion(data.habilitar); // Store in state
        console.log('Dato habilitar:', data.habilitar); // Log the value directly
        if (data.habilitar === "True") {
          setButtonEnabled(true); // Now it will work
        } else {
          setButtonEnabled(false); // Now it will work
        }*/
      }
    });

    /*
    newSocket.on('conexionAppSecadorasRotDev', (data) => {
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
    */

    /*
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
    */

    setSocket(newSocket);

    // Limpia la conexión al desmontar el componente
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Mandar datos de seteo de ciclos al presionar el boton iniciar prueba
  const sendMessage = () => {
    const datos = {
      ciclosLavadoras: ciclosLavadoras,
      velocidadLavadoras: velocidadLavadoras,
      pausarLavadoras : 'NO',
      tiempoPiston1: tiempoPiston1,
      tiempoPiston2: tiempoPiston2,
      tiempoPiston3: tiempoPiston3,
      tiempoPiston4: tiempoPiston4,
    };
    socket.emit('datosFromLavadoras', datos);
  };

  const sendMessage_pausar = () => {
    const datos = {
      pausarLavadoras: 'SI',
    };
    socket.emit('datosFromLavadorasPausar', datos);
  };

  const sendMessage_reanudar = () => {
    const datos = {
      pausarLavadoras: 'NO',
    };
    socket.emit('datosFromLavadorasPausar', datos);
  };


  // Función para resetear valores
  const resetValues = () => {
    
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

  const fillValueForProgress = setCiclosLavadorasAnimacion !== '0' && !isNaN(parseFloat(setCiclosLavadorasAnimacion))
    ? (conteoCiclosLavadoras * 100) / parseFloat(setCiclosLavadorasAnimacion)
    : 0;


  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <MaterialCommunityIcons name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>

      <View style={styles.containerCards}>
        <InfoCard title="Ciclos" value= {conteoCiclosLavadoras.toString()} />
        <InfoCard title="Estado" value={estadoLavadoras.toString()} />
        <InfoCard title="Velocidad de ciclos (CPM)" value={setVelocidadLavadorasA.toString()} />
        <InfoCard title="Tiempo transcurrido (min)" value={tiempoLavadoras.toString()} />
      </View>

      <View style={styles.cardContainerCircular} title="Flexiones">
      
          <Text style={styles.cardTitle}>Progreso de Ciclos</Text>
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
              {Math.round((fill * parseFloat(setCiclosLavadorasAnimacion)) / 100)} / {Math.round(parseFloat(setCiclosLavadorasAnimacion))}
            </Text>
          )}
        </AnimatedCircularProgress>

      </View>

      <View style={styles.cardContainerPistones} title="Flexiones">
        {/* Row 1: Pistón 1 and 2 */}
        <View style={styles.row}>
          {/* Pistón 1 */}
          <View style={styles.pistonBox}>
            <View style={styles.labelRow}>
              <Text style={styles.title}>PISTÓN 1</Text>
              {/*<Switch
                trackColor={{ false: '#767577', true: '#f5dd4b' }}
                thumbColor={isEnabled1 ? '#FFD700' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch1}
                value={isEnabled1}
              />*/}
            </View>
            <TextInput
              style={styles.input}
              value={tiempoPiston1}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setTeimpoPiston1(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese el tiempo de accion antes de activar brazo"
            />
          </View>

          {/* Pistón 2 */}
          <View style={styles.pistonBox}>
            <View style={styles.labelRow}>
              <Text style={styles.title}>PISTÓN 2</Text>
              {/*<Switch
                trackColor={{ false: '#767577', true: '#f5dd4b' }}
                thumbColor={isEnabled2 ? '#FFD700' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch2}
                value={isEnabled2}
              />*/}
            </View>
            <TextInput
              style={styles.input}
              value={tiempoPiston2}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setTeimpoPiston2(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese ciclos/minuto"
            />
          </View>
        </View>

  {/* Row 2: Pistón 3 and 4 */}
  <View style={styles.row}>
    {/* Pistón 3 */}
    <View style={styles.pistonBox}>
      <View style={styles.labelRow}>
        <Text style={styles.title}>PISTÓN 3</Text>
        {/*<Switch
          trackColor={{ false: '#767577', true: '#f5dd4b' }}
          thumbColor={isEnabled3 ? '#FFD700' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch3}
          value={isEnabled3}
        />*/}
      </View>
      <TextInput
        style={styles.input}
        value={tiempoPiston3}
        onChangeText={(text) => {
          if (text === '0') {
            alert('El valor no puede ser 0');
            return;
          }
          setTeimpoPiston3(text);
        }}
        keyboardType="numeric"
        placeholder="Ingrese ciclos/minuto"
      />
    </View>

    {/* Pistón 4 */}
    <View style={styles.pistonBox}>
      <View style={styles.labelRow}>
        <Text style={styles.title}>PISTÓN 4</Text>
      {/*<Switch
          trackColor={{ false: '#767577', true: '#f5dd4b' }}
          thumbColor={isEnabled4 ? '#FFD700' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch4}
          value={isEnabled4}
        />*/}
      </View>
      <TextInput
        style={styles.input}
        value={tiempoPiston4}
        onChangeText={(text) => {
          if (text === '0') {
            alert('El valor no puede ser 0');
            return;
          }
          setTeimpoPiston4(text);
        }}
        keyboardType="numeric"
        placeholder="Ingrese ciclos/minuto"
      />
    </View>
  </View>
</View>


            <Text style={styles.title}>CANTIDAD DE CICLOS</Text>
            <TextInput
              style={styles.input}
              value={ciclosLavadoras}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setCiclosLavadoras(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese el numero de ciclos totales totales"
            />

            <Text style={styles.title}>TIEMPO DE APERTURA Y CIERRE</Text>
            <TextInput
              style={styles.input}
              value={velocidadLavadoras}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setVelocidadLavadoras(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese el tiempo en segundos para abrir y cerrar la puerta"
            />      
      <View style={styles.buttonContainer}>
        <Button 
        title="Iniciar nueva prueba" 
        color="#FFD700"
        /*disabled={!buttonEnabled}*/
        onPress={sendMessage} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Pausar prueba" 
        color="#FFD700" 
        onPress={sendMessage_pausar}
        /*disabled={!buttonEnabled} *//>
      </View>
      <View style={styles.buttonContainerxd}>
        <Button title="Reanudar prueba" 
        color="#FFD700" 
        onPress={sendMessage_reanudar}
        /*disabled={!buttonEnabled}*/ />
      </View> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  image: {
    width: 100,
    height: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 20,
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
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: 200,
  },

  buttonContainerxd: {
    marginTop: 10,
    marginBottom: 40,
    borderRadius: 5,
    overflow: 'hidden',
    width: 200,
  },
  
  input: {
    height: 40,
    borderColor: '#FFD700',
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
    marginTop: 30
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
    padding: 20,             // Optional: Add some padding inside the card
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

  cardContainerPistones: {
    backgroundColor: 'white', // Set the background to white
    borderRadius: 20,        // Optional: Add rounded corners for a softer look
    padding: 20,             // Optional: Add some padding inside the card
    marginVertical: 10,       // Optional: Add vertical margin to separate cards
    marginHorizontal: 0,     // Optional: Add horizontal margin
    borderColor: '#FFD700',       // Set a light gray border color for contrast
    borderWidth: 1,          // Set the border width
    alignItems: 'center',     // Center the content horizontally within the card
    justifyContent: 'center', // Center the content vertically within the card (if needed)
    // Optional: Add shadow for a lifted effect (platform-specific)
    shadowColor: '#000000ff',
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

  row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
  },

  pistonBox: {
    flex: 1,
    marginHorizontal: 30,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },


});

export default MaquinaLavadorasCiclos;
