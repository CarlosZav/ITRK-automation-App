import React, { useState, useEffect } from 'react';
import { View, Text, State, Button, StyleSheet, Image, Dimensions, Alert , TextInput, TouchableOpacity} from 'react-native';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import { ScrollView } from 'react-native-gesture-handler';
import { ProgressChart } from 'react-native-chart-kit';
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

const MaquinaSecadorasRotacionesScreen = ({ navigation }) => {

  const [revolucionesSecadoras, setRevoluciones] = useState('');
  const [revCambioSecadoras, setCambio] = useState('');
  const [velocidadRevoluciones, setVelocidadRevoluciones] = useState('');  
  const [revolucionesSecadorasCircular, setRevolucionesCircular] = useState('0');

  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  //CARDS
  const [conteo_revSecadorasRot, setConteo_revSecadorasRot] = useState(0);
  const [estado_pruebaSecadorasRot, setEstado_pruebaSecadorasRot] = useState("Stop");
  const [tiempo_pruebaSecadorasRot, setTiempo_pruebaSecadorasRot] = useState(0);
  const [velocidad_SecadorasRot, setVelocidad_SecadorasRot] = useState(0);
  const [setRevolucionesSecadoras, setSetRevolucionesSecadoras] = useState('0');
  const [conexionEspSecadorasRotacion, setConexionEspSecadorasRotacion] = useState('');

  const [buttonEnabled, setButtonEnabled] = useState(false); // Initially disabled

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

    // Aquí agregas la escucha directa a 'datosServidor'
    newSocket.on('datosServerPlanchas', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConteo_revSecadorasRot(data.conteo_revSecadorasRot);
        setEstado_pruebaSecadorasRot(data.estado_pruebaSecadorasRot);
        setVelocidad_SecadorasRot(data.velocidad_SecadorasRot);
        setSetRevolucionesSecadoras(data.setRevSecadorasRot);
        setTiempo_pruebaSecadorasRot(parseFloat((data.tiempo_pruebaSecadorasRot / 60).toFixed(4)));
        console.log('conteo_revSecadorasRot:', data.conteo_revSecadorasRot);
        console.log('estado_pruebaSecadorasRot:', data.estado_pruebaSecadorasRot);
        console.log('velocidad_SecadorasRot:', data.velocidad_SecadorasRot);
        console.log('tiempo_pruebaSecadorasRot:', parseFloat((data.tiempo_pruebaSecadorasRot / 60).toFixed(4)));
        console.log('revoluciones establecidas:', data.setRevSecadorasRot)

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

    // Limpia la conexión al desmontar el componente
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Mandar datos de seteo de ciclos al presionar el boton iniciar prueba
  const sendMessage = () => {
    const datos = {
      revolucionesSecadoras: revolucionesSecadoras,
      revCambioSecadoras: revCambioSecadoras,
      velocidadRevoluciones: velocidadRevoluciones,
      pausarSecadorasRot : 'NO'
    };
    socket.emit('datosfromSecadorasRot', datos);
  };

  const sendMessage_pausar = () => {
    const datos = {
      pausarSecadorasRot: 'SI',
    };
    socket.emit('datosfromSecadorasRotaciones_pausar', datos);
  };

  const sendMessage_reanudar = () => {
    const datos = {
      pausarSecadorasRot: 'NO',
    };
    socket.emit('datosfromSecadorasRotaciones_pausar', datos);
  };

  // Función para resetear valores
  const resetValues = () => {
    
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

   // Calculate the fill value for the circular progress
  const fillValueForProgress = setRevolucionesSecadoras !== '0' && !isNaN(parseFloat(setRevolucionesSecadoras))
    ? (conteo_revSecadorasRot * 100) / parseFloat(setRevolucionesSecadoras)
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
        <InfoCard title="Corriente (A)" value= {conteo_revSecadorasRot.toString()} />
        <InfoCard title="Estado" value={estado_pruebaSecadorasRot.toString()} />
        <InfoCard title="Velocidad de flexion (FPM)" value={velocidad_SecadorasRot.toString()} />
        <InfoCard title="Tiempo transcurrido (min)" value={tiempo_pruebaSecadorasRot.toString()} />
      </View>

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
              {Math.round((fill * parseFloat(setRevolucionesSecadoras)) / 100)} / {Math.round(parseFloat(setRevolucionesSecadoras))}
            </Text>
          )}
        </AnimatedCircularProgress>

      </View>

            <Text style={styles.title}>CANTIDAD DE REVOLUCIONES</Text>
            <TextInput
              style={styles.input}
              value={revolucionesSecadoras}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setRevoluciones(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese ciclos"
            />
            
            <Text style={styles.title}>REVOLUCIONES DE CAMBIO</Text>
            <TextInput
              style={styles.input}
              value={revCambioSecadoras}
                onChangeText={(text) => {
                  if (text === '0') {
                    alert('El valor no puede ser 0');
                    return;
                  }
                  setCambio(text);
                }}
              keyboardType="numeric"
              placeholder="Ingrese el número de revoluciones para cambiar sentido"
            />

            <Text style={styles.title}>VELOCIDAD</Text>
            <TextInput
              style={styles.input}
              value={velocidadRevoluciones}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setVelocidadRevoluciones(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese la velocidad en RPMs"
            />
      
      <View style={styles.buttonContainer}>
        <Button title="Iniciar nueva prueba"
         color="#FFD700"  // Gray if disabled
         onPress={sendMessage}
         disabled={!buttonEnabled} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Pausar prueba" 
        color="#FFD700"
        onPress={sendMessage_pausar}
        disabled={!buttonEnabled} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Reanudar prueba" 
        color="#FFD700"
        onPress={sendMessage_reanudar}
        disabled={!buttonEnabled} />
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
    top: 10,
    right: 20,
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

export default MaquinaSecadorasRotacionesScreen;
