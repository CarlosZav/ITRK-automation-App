import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput, TouchableOpacity} from 'react-native';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/Ionicons';

const SERVER_URL = 'http://10.224.54.107:5000';

const MaquinaFlexionesScreen = ({ navigation }) => {

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

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.helpIcon}
        onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
      >
        <Icon name="help-circle-outline" size={30} color="#FFD700" />
      </TouchableOpacity>

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

  helpIcon: {
    position: 'absolute',
    top: 10, // Ajusta según tu diseño
    right: 10, // Ajusta según tu diseño
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

export default MaquinaFlexionesScreen;
