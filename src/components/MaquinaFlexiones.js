import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button,StyleSheet, Image, Alert , TextInput, TouchableOpacity, ScrollView, Animated, Easing} from 'react-native';
import { io } from "socket.io-client";
import Slider from '@react-native-community/slider';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SERVER_URL = 'http://192.168.0.101:5000'; // 192.168.0.101

const MaquinaFlexionesScreen = ({ navigation }) => {

  const [ciclosF, setCiclos] = useState('');
  const [angulo1, setAngulo1] = useState('');
  const [angulo2, setAngulo2] = useState(''); 
  const [value, setValue] = useState(0);
  const [value1, setValue1] = useState(45); // Valor inicial del primer slider
  const [value2, setValue2] = useState(45); // Valor inicial del segundo slider

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  const [conexionEspSecadorasRotacion, setConexionEspSecadorasRotacion] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false); // Initially disabled

  const [setCiclosF, setSetCiclosF] = useState('0');
  const [velocidad_SecadorasRot, setVelocidad_SecadorasRot] = useState(0);

  const [expanded, setExpanded] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;

  const [secondExpanded, setSecondExpanded] = useState(false);
  const secondAnimationController = useRef(new Animated.Value(0)).current;

  const [buttonEnabledIniciar, setButtonEnabledIniciar] = useState(false); // Tu estado actual
  const [isConfigValidated, setIsConfigValidated] = useState(false); // <-- AGREGA ESTA LÍNEA

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
    setSocket(newSocket);

    // Limpia la conexión al desmontar el componente
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Mandar datos de seteo de ciclos al presionar el boton iniciar prueba
  const sendMessage = () => {
    const datos = {
      seteo_ciclosF: ciclosF,
      seteo_anguloA: value1,
      seteo_anguloB: value2,
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

  const sendMessage_reanudar = () => {
    const datos = {
      pausarF: 'NO',
    };
    socket.emit('datosfromFlexiones_pausar', datos);
  };

  const recibirDatos = () => {
    // Eliminar cualquier listener existente para evitar duplicados
    socket.off('datosServidorFlexiones');
  
    // Registrar un nuevo listener
    socket.on('datosServidorFlexiones', (data) => {
      // Validar que data no sea nulo, indefinido ni vacío
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
  
        let conteo_ciclosFlex = data.conteo_ciclosF;
        let estado_pruebaFlex = data.estado_pruebaF;
        let tiempo_transcurridoFlex = (data.tiempo_transcurridoF) / 60;
  
        console.log('Ciclos transcurridos: ', conteo_ciclosFlex);
        console.log('Estado de la prueba: ', estado_pruebaFlex);
        console.log('Tiempo transcurrido (min): ', tiempo_transcurridoFlex);

        /*
        setConexionEspSecadorasRotacion(data.habilitar); // Store in state
        console.log('Dato habilitar:', data.habilitar); // Log the value directly
        if (data.habilitar === "True") {
          setButtonEnabled(true); // Now it will work
        } else {
          setButtonEnabled(false); // Now it will work
        }
        */
  
        Alert.alert(
          'Datos recibidos',
          `Ciclos transcurridos: ${conteo_ciclosFlex}\nEstado de la prueba: ${estado_pruebaFlex}\nTiempo transcurrido (min): ${tiempo_transcurridoFlex}`
        );
      } else {
        Alert.alert('Advertencia', 'No se recibieron datos válidos del servidor.');
      }
    });
  
    // Emitir solicitud al servidor
    socket.emit('recibirDatosServerFlexionesOG');
  };

  // Función para resetear valores
  const resetValues = () => {
    
  };

  const configuracionPrevia = () => {
    setButtonEnabledIniciar(true); // <-- Activamos el botón aquí
    Alert.alert('Te aseguraste que todo está correcto, ahora puedes iniciar la prueba');
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

  const incrementValue = (setValue, currentValue) => {
    if (currentValue < 200) {
      setValue(currentValue + 5);
    }
  };

  const decrementValue = (setValue, currentValue) => {
    if (currentValue > 0) {
      setValue(currentValue - 5);
    }
  };
  /*
  const fillValueForProgress = setRevolucionesSecadoras !== '0' && !isNaN(parseFloat(setRevolucionesSecadoras))
    ? (conteo_revSecadorasRot * 100) / parseFloat(setRevolucionesSecadoras)
    : 0;
  */
  return (
    <ScrollView style={styles.container}>

      <Image
        source={require('../../assets/Maquina2.png')}
        style={styles.image}
      />

      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <MaterialCommunityIcons name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>

      <View style={styles.containerButtonx}>
        {/* Main Trigger Button */}
        <TouchableOpacity style={styles.buttonPrime} onPress={toggleMenu} activeOpacity={0.8}>
            <Text style={styles.buttonTextPrime}>{expanded ? "Configuración previa" : "Mostar configuración previa"}</Text>
            <Animated.Text style={{ transform: [{ rotate: arrowAngle }], color: 'white' }}>
            ▼
            </Animated.Text>
        </TouchableOpacity>

        <Animated.View style={[styles.extraContent, { height: bodyHeight, opacity: bodyOpacity }]}>
          
          <Text style={{color: 'black'}}>1. Sigue cada paso con precaución, Antes de iniciar revisa que todo esté bien y alejate del área de movimiento de la máquina</Text>
          <Text style={{color: 'black'}}> </Text>
          <Text style={{color: 'black'}}>2. Establece tu punto inicial manualmente</Text>
          <Text style={{color: 'black'}}> </Text>
          <Text style={{color: 'black'}}>3. Conecta la maquina para que detecte ese punto inicial</Text>
          <Text style={{color: 'black'}}> </Text>
          <Text style={{color: 'black'}}>4. Prende el aire y revisa que la presión indicada en el regulador sea menor o igual a 2 bar</Text>
          <Text style={{color: 'black'}}> </Text>
          <Text style={{color: 'black'}}>5. Si todo está bien, alejate y presiona el botón "Correcto"</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={configuracionPrevia} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Correcto</Text></TouchableOpacity>
          </View>
        
        </Animated.View>
      </View>

      <Text style={styles.title}>CANTIDAD DE CICLOS</Text>
      <TextInput
        style={styles.input}
        value={ciclosF}
        onChangeText={setCiclos}
        keyboardType="numeric"
        placeholder="Ingrese ciclos"
      />

      {/*<Text style={styles.title}>ÁNGULO DE GIRO 1</Text>
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
      />*/}

      <View style={styles.sliderContainer}>
        <Text style={styles.title}>ÁNGULO SENTIDO HORARIO</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={200}
          step={5}
          value={value1}
          onValueChange={(val) => setValue1(val)}
          minimumTrackTintColor="#FFD700" // Color amarillo para la parte izquierda de la barra
          maximumTrackTintColor="#DDD" // Color gris claro para la parte derecha de la barra
          thumbTintColor="#FFD700" // Color amarillo para el control deslizante (thumb)
        />
        <View style={styles.buttonContainer2}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => decrementValue(setValue1, value1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => incrementValue(setValue1, value1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.title}>ÁNGULO SENTIDO ANTIHORARIO</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={200}
          step={5}
          value={value2}
          onValueChange={(val) => setValue2(val)}
          minimumTrackTintColor="#FFD700" // Color amarillo para la parte izquierda de la barra
          maximumTrackTintColor="#DDD" // Color gris claro para la parte derecha de la barra
          thumbTintColor="#FFD700" // Color amarillo para el control deslizante (thumb)
        />
        <View style={styles.buttonContainer2}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => decrementValue(setValue2, value2)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => incrementValue(setValue2, value2)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[
        styles.buttonContainer, 
        { backgroundColor: buttonEnabledIniciar ? '#FFD700' : '#CCCCCC' } // El contenedor ahora maneja el color de fondo
      ]}>
        <TouchableOpacity 
          onPress={sendMessage} 
          disabled={!buttonEnabledIniciar}
          style={styles.customStartButton}
        >
          <Text style={styles.customStartButtonText}>Iniciar nueva prueba</Text>
        </TouchableOpacity>
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
    marginTop: 20,
    marginBottom: 20,
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

  contentContainer: {
    justifyContent: 'center', // Mover justifyContent aquí
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: 200,
    alignSelf: 'center', // Centrar el contenedor
  },

  buttonText: {
    color: '#FFD700', // Color amarillo
    fontSize: 20,
    fontWeight: 'bold', // Texto en negrita
  },

  sliderContainer: {
    width: '100%',
    marginBottom: 30, // Espacio entre los dos sliders
    alignItems: 'center',
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Texto en dorado
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
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

  sliderContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center'

  },
  slider: {
    width: '100%',
    height: 40,
  },
  
  buttonContainer2: {
    flexDirection: 'row',
    gap: 50, // Espacio entre los botones
    marginTop: 10,
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#FFFFFF', // Fondo blanco
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD', // Borde gris claro
    width: 50, // Ancho fijo para los botones
    alignItems: 'center', // Centrar el contenido
  },
  buttonText: {
    color: '#FFD700', // Color amarillo
    fontSize: 20,
    fontWeight: 'bold', // Texto en negrita
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

  containerButtonx: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden', // Crucial for hiding the retracting content
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // alignContent: 'center', <-- Esto no afecta al centrado del contenedor en sí
    alignSelf: 'center',       // <-- AGREGA ESTA LÍNEA PARA CENTRARLO
    marginBottom: 30
  },

  buttonPrime: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 15,
  backgroundColor: '#FFD700',
  },

  buttonTextPrime: {
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

  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: 200,
    height: 38, // <-- Forzamos la altura para que sea idéntico a los <Button /> nativos de abajo
    alignSelf: 'center', 
  },

  customStartButton: {
    flex: 1, // Se estira para ocupar todo el buttonContainer
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  customStartButtonText: {
    color: 'white', // En iOS el texto nativo es azul/dorado, pero en Android es blanco. Si usas Android, 'white' mantendrá la simetría perfecta.
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Los botones nativos suelen renderizar en mayúsculas en varias plataformas
  },
  
});

export default MaquinaFlexionesScreen;