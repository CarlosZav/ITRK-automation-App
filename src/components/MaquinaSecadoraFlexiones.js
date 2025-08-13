import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput, TouchableOpacity} from 'react-native';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import { ScrollView } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const SERVER_URL = 'http://192.168.0.101:5000';

const InfoCard = ({ title, value }) => (
  <View style={styles.cardWrapper}>
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const MaquinaSecadorasFlexionesScreen = ({ navigation }) => {

  const [flexionesSecadoras, setFlexiones] = useState('');
  const [anguloA, setAnguloA] = useState('');
  const [anguloB, setAnguloB] = useState('');
  const [setVelocidadSecadorasFlex, setVelocidadFlexion] = useState('');  

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  //CARDS
  const [conteoFlexSecadoras, setConteoFlexSecadoras] = useState(0);
  const [estadoSecadorasFlex, setEstadoSecadorasFlex] = useState("Stop");
  const [tiempoSecadorasFlex, setTiempoSecadorasFlex] = useState(0);
  const [velocidadFlexiones, setVelocidadFlexiones] = useState(0);

  const [setFlexionesSecadoras, setSetFlexionesSecadoras] = useState('0');
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

      const datos = {
        mensaje: 'conexionSatisfactoria',
      };

      newSocket.emit('conexionAppSecadorasRot', datos);
    });

    newSocket.on('message', (msg) => {
      console.log('Message from server:', msg);
      setMessage(msg);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Aquí agregas la escucha directa a 'datosServidor'
    newSocket.on('datosServidorasSecadorasFlex', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConteoFlexSecadoras(data.conteoFlexSecadoras);
        setEstadoSecadorasFlex(data.estadoSecadorasFlex);
        setVelocidadFlexiones(data.velocidadFlexiones);
        setSetFlexionesSecadoras(data.setConteoFlexSecadoras);
        setTiempoSecadorasFlex(parseFloat((data.tiempoSecadorasFlex / 60).toFixed(4)));

        setConexionEspSecadorasRotacion(data.habilitar); // Store in state
        console.log('Dato habilitar:', data.habilitar); // Log the value directly
        if (data.habilitar === "True") {
          setButtonEnabled(true); // Now it will work
        } else {
          setButtonEnabled(false); // Now it will work
        }
      }
    });

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

    // Limpia la conexión al desmontar el componente
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Mandar datos de seteo de ciclos al presionar el boton iniciar prueba
  const sendMessage = () => {
    const datos = {
      flexionesSecadoras: flexionesSecadoras,
      anguloA: anguloA,
      anguloB: anguloB,
      setVelocidadSecadorasFlex: setVelocidadSecadorasFlex,
      pausarSecadorasFlex : 'NO'
    };
    socket.emit('datosfromSecadorasFlex', datos);
  };

  const sendMessage_pausar = () => {
    const datos = {
      pausarSecadorasFlex: 'SI',
    };
    socket.emit('datosfromSecadorasFlexionesPausar', datos);
  };

  const sendMessage_reanudar = () => {
    const datos = {
      pausarSecadorasFlex: 'NO',
    };
    socket.emit('datosfromSecadorasFlexionesPausar', datos);
  };

  const recibirDatos = () => {
    // Eliminar cualquier listener existente para evitar duplicados
    socket.off('datosServidorasSecadorasFlex');
  
    // Registrar un nuevo listener
    socket.on('datosServidorasSecadorasFlex', (data) => {
      // Validar que data no sea nulo, indefinido ni vacío
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
  
        let conteoFlexSecadoras = data.conteoFlexSecadoras;
        let estadoSecadorasFlex = data.estadoSecadorasFlex;
        let tiempoSecadorasFlex = (data.tiempoSecadorasFlex) / 60;
        let velocidadFlexiones = (data.velocidadFlexiones);
        let flexionesSecadoras = (data.flexionesSecadoras);

        console.log('Flexiones transcurridos: ', conteoFlexSecadoras);
        console.log('Estado de la prueba: ', estadoSecadorasFlex);
        console.log('Tiempo transcurrido (min): ', tiempoSecadorasFlex);
        console.log('velocidadFlexiones: ', velocidadFlexiones);
        console.log('set de Flexiones: ', flexionesSecadoras);
  
        Alert.alert(
          'Datos recibidos',
          `Ciclos transcurridos: ${conteoFlexSecadoras}\nEstado de la prueba: ${estadoSecadorasFlex}\nTiempo transcurrido (min): ${tiempoSecadorasFlex}\nFlexiones establecidas: ${flexionesSecadoras}`
        );
      } else {
        Alert.alert('Advertencia', 'No se recibieron datos válidos del servidor.');
      }
    });
  
    // Emitir solicitud al servidor
    socket.emit('recibirDatosServerFlexiones');
  };

  // Función para resetear valores
  const resetValues = () => {
    
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

  const fillValueForProgress = setFlexionesSecadoras !== '0' && !isNaN(parseFloat(setFlexionesSecadoras))
    ? (conteoFlexSecadoras * 100) / parseFloat(setFlexionesSecadoras)
    : 0;


  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <Icon name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/Maquina2.png')}
        style={styles.image}
      />

      <View style={styles.containerCards}>
        <InfoCard title="Flexiones" value= {conteoFlexSecadoras.toString()} />
        <InfoCard title="Estado" value={estadoSecadorasFlex.toString()} />
        <InfoCard title="Velocidad de flexion (FPM)" value={velocidadFlexiones.toString()} />
        <InfoCard title="Tiempo transcurrido (min)" value={tiempoSecadorasFlex.toString()} />
      </View>

      <View style={styles.cardContainerCircular} title="Flexiones">
      
          <Text style={styles.cardTitle}>Progreso de Flexiones</Text>
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
              {Math.round((fill * parseFloat(setFlexionesSecadoras)) / 100)} / {Math.round(parseFloat(setFlexionesSecadoras))}
            </Text>
          )}
        </AnimatedCircularProgress>

      </View>



            <Text style={styles.title}>CANTIDAD DE FLEXIONES</Text>
            <TextInput
              style={styles.input}
              value={flexionesSecadoras}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setFlexiones(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese el numero de flexiones totales"
            />

            <Text style={styles.title}>ÁNGULO DE GIRO 1</Text>
            <TextInput
              style={styles.input}
              value={anguloA}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setAnguloA(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese angulo 1"
            />

            <Text style={styles.title}>ÁNGULO DE GIRO 2</Text>
            <TextInput
              style={styles.input}
              value={anguloB}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setAnguloB(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese angulo 2"
            />

            <Text style={styles.title}>VELOCIDAD DE FLEXIONES</Text>
            <TextInput
              style={styles.input}
              value={setVelocidadSecadorasFlex}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setVelocidadFlexion(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese el numero de flexiones por min"
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
      <View style={styles.buttonContainer}>
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

export default MaquinaSecadorasFlexionesScreen;