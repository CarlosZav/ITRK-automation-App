import { useEffect, useState, useRef } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { io } from "socket.io-client";
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
 
const SERVER_URL = 'http://192.168.0.101:5000';
 
const InfoCard = ({ title, value }) => (
  <View style={styles.cardWrapper}>
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);
 
const MaquinaHornosCiclos = ({ navigation }) => {

  const [gradosCalibrar, setGradosCalibrar] = useState('');
 
  //PISTON 1
  const [isEnabled1, setIsEnabled1] = useState(false);
  const toggleSwitch1 = () => setIsEnabled1(previousState1=> !previousState1);
  const [tiempoPiston1Hornos, setTeimpoPiston1] = useState('0');
 
  //PISTON 2
  const [isEnabled2, setIsEnabled2] = useState(false);
  const toggleSwitch2 = () => setIsEnabled2(previousState2 => !previousState2);
  const [tiempoPiston2Hornos, setTeimpoPiston2] = useState('0');
 
  //PISTON 3
  const [isEnabled3, setIsEnabled3] = useState(false);
  const toggleSwitch3 = () => setIsEnabled3(previousState3 => !previousState3);
  const [tiempoPiston3Hornos, setTeimpoPiston3] = useState('0');
 
  //PIESTON 4
  const [isEnabled4, setIsEnabled4] = useState(false);
  const toggleSwitch4 = () => setIsEnabled4(previousState4 => !previousState4);
  const [tiempoPiston4Hornos, setTeimpoPiston4] = useState('0');
 
  const [ciclosHornos, setCiclosHornos] = useState('');
  const [anguloApertura, setAnguloApertura] = useState('');
  const [velocidadHornos, setVelocidadHornos] = useState('');  
 
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
 
  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');
 
  //CARDS
  const [conteoCiclosHornos, setConteoCiclosHornos] = useState(0);
  const [estadoHornos, setEstadoHornos] = useState("Stop");
  const [tiempoHornos, setTiempoHornos] = useState(0);
 
  const [setCiclosHornosAnimacion, setSetCiclosHornos] = useState('0');
  const [setVelocidadHornosA, setSetVelocidadHornos] = useState('0');
  const [conexionEspSecadorasRotacion, setConexionEspSecadorasRotacion] = useState('');
 
  const [buttonEnabled, setButtonEnabled] = useState(false); // Initially disabled

  const [expanded, setExpanded] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;

  const [secondExpanded, setSecondExpanded] = useState(false);
  const secondAnimationController = useRef(new Animated.Value(0)).current;

  const [accionPiston1, setAccionPiston1] = useState('apagar1');
  const [accionPiston2, setAccionPiston2] = useState('apagar2');

  const toggleMenu = () => {
    const config = {
    toValue: expanded ? 0 : 1,
    duration: 500,
    useNativeDriver: false, // Height doesn't support native driver
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    };

    Animated.timing(animationController, config).start();
    setExpanded(!expanded);
  };


  const arrowAngle = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const bodyHeight = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 380], // Adjust 150 to the height of your hidden content
  });

  const bodyOpacity = animationController.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const secondToggleMenu = () => {
    const config = {
    toValue: secondExpanded ? 0 : 1,
    duration: 500,
    useNativeDriver: false, // Height doesn't support native driver
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    };

    Animated.timing(secondAnimationController, config).start();
    setSecondExpanded(!secondExpanded);
  };


  const secondArrowAngle = secondAnimationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const secondBodyHeight = secondAnimationController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 600], // Adjust 150 to the height of your hidden content
  });

  const secondBodyOpacity = secondAnimationController.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
 
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
    });
 
    newSocket.on('message', (msg) => {
      console.log('Message from server:', msg);
      setMessage(msg);
    });
 
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('calibracionConfirmacionHornosApp', (data) => {
      console.log('confirmacion de punto establecido');
      alert('Calibración correcta');
    });
 
    // Aquí agregas la escucha directa a 'datosServidor'
    newSocket.on('datosServidorHornos', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConteoCiclosHornos(data.conteoCiclosHornos);
        setEstadoHornos(data.estadoHornos);
        setSetVelocidadHornos(data.velocidadHornos);
        setSetCiclosHornos(data.ciclosHornos);
        setTiempoHornos(parseFloat((data.tiempoHornos / 60).toFixed(4)));
       
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
      ciclosHornos: ciclosHornos,
      anguloApertura: anguloApertura,
      velocidadHornos: velocidadHornos,
      pausarHornos : 'NO',
      tiempoPiston1Hornos: tiempoPiston1Hornos,
      tiempoPiston2Hornos: tiempoPiston2Hornos,
      tiempoPiston3Hornos: tiempoPiston3Hornos,
      tiempoPiston4Hornos: tiempoPiston4Hornos,
    };
    socket.emit('datosFromHornos', datos);
  };
 
  const sendMessage_pausar = () => {
    const datos = {
      pausarHornos: 'SI',
    };
    socket.emit('datosFromHornosPausar', datos);
  };
 
  const sendMessage_reanudar = () => {
    const datos = {
      pausarHornos: 'NO',
    };
    socket.emit('datosFromHornosPausar', datos);
  };

  const sendMessageCalibrarAntihorario = () => {
    const datos = {
      gradosCalibrar: gradosCalibrar,
      sentido: 'Antihorario',
    };
    socket.emit('datosfromCalibrarHornos', datos);
  };

  const sendMessageCalibrarHorario = () => {
    const datos = {
      gradosCalibrar: gradosCalibrar,
      sentido: 'Horario',
    };
    socket.emit('datosfromCalibrarHornos', datos);
  };

  const sendMessageEstablecerCero = () => {
    const datos = {
      gradosCalibrar: 0,
      sentido: 'EstablecerCero',
    };
    socket.emit('datosfromCalibrarHornos', datos);
  };

  const sendMessageEstablecerFinal = () => {
    const datos = {
      gradosCalibrar: 0,
      sentido: 'EstablecerFinal',
    };
    socket.emit('datosfromCalibrarHornos', datos);
  };

  const sendMessageVentosaHornos = () => {
    const datos = {
      gradosCalibrar: 0,
      sentido: 'ventosa',
    };
    socket.emit('datosfromCalibrarHornos', datos);
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
    socket.emit('datosfromCalibrarHornos', datos);
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
    socket.emit('datosfromCalibrarHornos', datos);
  };

 
 
  // Función para resetear valores
  const resetValues = () => {
   
  };
 
  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };
 
  const fillValueForProgress = setCiclosHornosAnimacion !== '0' && !isNaN(parseFloat(setCiclosHornosAnimacion))
    ? (conteoCiclosHornos * 100) / parseFloat(setCiclosHornosAnimacion)
    : 0;
 
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
 
      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <MaterialCommunityIcons name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>
 
      <Image
        source={require('../../assets/Maquina2.png')}
        style={styles.image}
      />
 
      <View style={styles.containerCards}>
        <InfoCard title="Ciclos" value= {conteoCiclosHornos.toString()} />
        <InfoCard title="Estado" value={estadoHornos.toString()} />
        <InfoCard title="Velocidad de ciclos (CPM)" value={setVelocidadHornosA.toString()} />
        <InfoCard title="Tiempo transcurrido (min)" value={tiempoHornos.toString()} />
      </View>
 
      <View style={styles.cardContainerCircular} title="Flexiones">
     
          <Text style={styles.cardTitle}>Progreso de Ciclos</Text>
        <AnimatedCircularProgress
          size={250}
          width={15}
          fill={fillValueForProgress} // porcentaje de pasos completados
          tintColor="#FFD700"
          backgroundColor="#3d5875"
          duration={1000}
          >
          {(fill) => (
            <Text style={styles.progressText}>
              {Math.round((fill * parseFloat(setCiclosHornosAnimacion)) / 100)} / {Math.round(parseFloat(setCiclosHornosAnimacion))}
            </Text>
          )}
        </AnimatedCircularProgress>
 
      </View>
     
      <View style={styles.containerButtonx}>
        {/* Main Trigger Button */}
        <TouchableOpacity style={styles.button} onPress={toggleMenu} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{expanded ? "Esconder opciones de configuración de prubea" : "Mostar opciones de configuración de prubea"}</Text>
            <Animated.Text style={{ transform: [{ rotate: arrowAngle }], color: 'white' }}>
            ▼
            </Animated.Text>
        </TouchableOpacity>

        <Animated.View style={[styles.extraContent, { height: bodyHeight, opacity: bodyOpacity }]}>
          

          <View style={styles.TextEntry}>
            <Text style={styles.title}>CANTIDAD DE CICLOS</Text>
              <TextInput
                style={styles.input}
                value={ciclosHornos}
                onChangeText={(text) => {
                  if (text === '0') {
                    alert('El valor no puede ser 0');
                    return;
                  }
                  setCiclosHornos(text);
                }}
                keyboardType="numeric"
                placeholder="Ingrese el numero de ciclos totales totales"
              />
  
              <Text style={styles.title}>VELOCIDAD DE CICLOS</Text>
              <TextInput
                style={styles.input}
                value={velocidadHornos}
                onChangeText={(text) => {
                  if (text === '0') {
                    alert('El valor no puede ser 0');
                    return;
                  }
                  setVelocidadHornos(text);
                }}
                keyboardType="numeric"
                placeholder="Ingrese el numero de ciclos por minuto"
              />
          </View>

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
                value={tiempoPiston1Hornos}
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
              </View>
              <TextInput
                style={styles.input}
                value={tiempoPiston2Hornos}
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
          
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={sendMessage} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Iniciar/Reiniciar</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendMessage_pausar} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Pausar</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendMessage_reanudar} style={[styles.subButton]}><Text style={{color: 'white'}}>Reanudar</Text></TouchableOpacity>
            </View>
        
        </Animated.View>
      </View>

      <View style={styles.containerButtonx}>

        <TouchableOpacity style={styles.button} onPress={secondToggleMenu} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{secondExpanded ? "Esconder opciones de calibración" : "Mostrar opciones de calibración"}</Text>
          <Animated.Text style={{ transform: [{ rotate: secondArrowAngle }], color: 'white' }}>
          ▼
          </Animated.Text>
        </TouchableOpacity>

        <Animated.View style={[styles.extraContent, { height: secondBodyHeight, opacity: secondBodyOpacity }]}>
          <View style={styles.containerCalibracion}>
            <Text style={styles.titleCalibracion}>CALIBRAR FUNCIÓN ABRE-PUERTAS DE HORNOS</Text>
            <TextInput
              style={styles.input}
              value={gradosCalibrar}
              onChangeText={setGradosCalibrar}
              keyboardType="numeric"
              placeholder="Ingrese el número de grados que desea"
            />
      
            <View style={styles.container2}>
              {/* Counterclockwise Button */}
              <TouchableOpacity style={styles.buttonCalibracion} onPress={sendMessageCalibrarAntihorario}>
                <MaterialCommunityIcons name="cog-counterclockwise" size={40} color="#FFD700" />
              </TouchableOpacity>
      
              {/* Clockwise Button */}
              <TouchableOpacity style={styles.buttonCalibracion} onPress={sendMessageCalibrarHorario}>
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

            <View style={styles.centerButtonContainer}>
              <Button title="Prender/Apagar ventosa" 
                color="#FFD700"
                /*disabled={!buttonEnabled} */
                onPress={sendMessageVentosaHornos} />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={sendMessagePiston1} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Activar/Desactivar Piston 1</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendMessagePiston2} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Activar/Desactivar Piston 2</Text></TouchableOpacity>
            </View>

          </View>
        </Animated.View>

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
    padding: 40,             // Optional: Add some padding inside the card
    marginVertical: 20,       // Optional: Add vertical margin to separate cards
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

  containerButtonx: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden', // Crucial for hiding the retracting content
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 30
  },

  button: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 15,
  backgroundColor: '#FFD700',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  extraContent: {
    width: '100%',
    backgroundColor: '#F9F9F9',
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
  
  infoText: {
    marginTop: 15,
    color: '#8E8E93',
    fontSize: 12,
  },

  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginTop: 10
  },

  input: {
    height: 40,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '80%',
    alignSelf: 'center',
  },

  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: 200,
    alignContent: 'center',
  },

  buttonAlign:{
    alignItems: 'center',
  },

  IconsRow:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }, 

  TextEntry:{
    marginTop: 10,
    alignItems: 'center'
  },

  containerCalibracion: {
    flex: 1,
    backgroundColor: '#fff',
  },

  titleCalibracion: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    marginBottom: 30
  },

  container2: {
    flexDirection: 'row', // Places items in a row
    justifyContent: 'space-between', // Space between buttons
    paddingHorizontal: 100, // Padding on both sides
    marginTop: 20,
  },

  buttonCalibracion: {
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
 
});
 
export default MaquinaHornosCiclos;