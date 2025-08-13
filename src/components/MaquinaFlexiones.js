import React, { useState, useEffect } from 'react';
import { View, Text, Button,StyleSheet, Image, Alert , TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { io } from "socket.io-client";
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import { AnimatedCircularProgress } from 'react-native-circular-progress';

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

    // Aquí agregas la escucha directa a 'datosServidor'
    newSocket.on('datosServidorasSecadorasFlex', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConteoFlexSecadoras(data.conteoFlexSecadoras);
        setEstadoSecadorasFlex(data.estadoSecadorasFlex);
        setVelocidadFlexiones(data.velocidadFlexiones);
        setTiempoSecadorasFlex(parseFloat((data.tiempoSecadorasFlex / 60).toFixed(4)));

        /*
        setConexionEspSecadorasRotacion(data.habilitar); // Store in state
        console.log('Dato habilitar:', data.habilitar); // Log the value directly
        if (data.habilitar === "True") {
          setButtonEnabled(true); // Now it will work
        } else {
          setButtonEnabled(false); // Now it will work
        }
        */
      }
    });

    // Se lee el mensaje de conexion
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
    socket.emit('recibirDatosServerFlexiones');
  };

  // Función para resetear valores
  const resetValues = () => {
    
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

      
      {/*
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
              {Math.round((fill * parseFloat(setRevolucionesSecadoras)) / 100)} / {Math.round(parseFloat(setRevolucionesSecadoras))}
            </Text>
          )}
        </AnimatedCircularProgress>

      </View>
      */}

      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <Icon name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>

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

export default MaquinaFlexionesScreen;