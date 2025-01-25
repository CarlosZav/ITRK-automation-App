import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput, TouchableOpacity} from 'react-native';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';

const SERVER_URL = 'http://192.168.0.101:5000';

const MaquinaSecadorasFlexionesScreen = ({ navigation }) => {

  const [ciclosF, setCiclos] = useState('');
  const [angulo1, setAngulo1] = useState('');
  const [angulo2, setAngulo2] = useState('');
  const [velocidadFlexion, setVelocidadFlexion] = useState('');  

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
    <ScrollView contentContainerStyle={styles.container}>

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
            <Text style={styles.title}>CANTIDAD DE FLEXIONES</Text>
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

            <Text style={styles.title}>VELOCIDAD DE FLEXIONES</Text>
            <TextInput
              style={styles.input}
              value={velocidadFlexion}
              onChangeText={setVelocidadFlexion}
              keyboardType="numeric"
              placeholder="Ingrese el numero de flexiones por min."
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
    right: 10,
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
});

export default MaquinaSecadorasFlexionesScreen;
