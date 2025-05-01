import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput, TouchableOpacity} from 'react-native';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import { ScrollView } from 'react-native-gesture-handler';

const SERVER_URL = 'http://10.224.55.216:5000';

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

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  //CARDS
  const [conteo_revSecadorasRot, setConteo_revSecadorasRot] = useState(0);
  const [estado_pruebaSecadorasRot, setEstado_pruebaSecadorasRot] = useState("Stop");
  const [tiempo_pruebaSecadorasRot, setTiempo_pruebaSecadorasRot] = useState(0);
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
    newSocket.on('datosServerPlanchas', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
        setConteo_revSecadorasRot(data.conteo_revSecadorasRot);
        setEstado_pruebaSecadorasRot(data.estado_pruebaSecadorasRot);
        setVelocidad_SecadorasRot(data.velocidad_SecadorasRot);
        setTiempo_pruebaSecadorasRot(parseFloat((data.tiempo_pruebaSecadorasRot / 60).toFixed(4)));
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

  const recibirDatos = () => {
    // Eliminar cualquier listener existente para evitar duplicados
    socket.off('datosServerPlanchas');
  
    // Registrar un nuevo listener
    socket.on('datosServerPlanchas', (data) => {
      // Validar que data no sea nulo, indefinido ni vacío
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);
  
        let conteo_revSecadorasRot = data.conteo_revSecadorasRot;
        let estado_pruebaSecadorasRot = data.estado_pruebaSecadorasRot;
        let tiempo_pruebaSecadorasRot = (data.tiempo_pruebaSecadorasRot) / 60;
        let velocidad_SecadorasRot = data.velocidad_SecadorasRot;
        let setRevSecadorasRot = data.setRevSecadorasRot;

        console.log('Revoluciones transcurridas: ', conteo_revSecadorasRot);
        console.log('Estado de la prueba: ', estado_pruebaSecadorasRot);
        console.log('tiempo de prueba ', tiempo_pruebaSecadorasRot);
        console.log('Velocidad (RPM): ', velocidad_SecadorasRot);
        console.log('Set revoluciones: ', setRevSecadorasRot);
  
        Alert.alert(
          'Datos recibidos',
          `Revoluciones transcurridos: ${conteo_revSecadorasRot}\n
          Estado de la prueba: ${estado_pruebaSecadorasRot}\n
          Tiempo transcurrido (min): ${tiempo_pruebaSecadorasRot}\n
          Velocidad (RPM):  ${velocidad_SecadorasRot}\n
          Set revoluciones: ${setRevSecadorasRot}`
        );
      } else {
        Alert.alert('Advertencia', 'No se recibieron datos válidos del servidor.');
      }
    });
  
    // Emitir solicitud al servidor
    socket.emit('recibirDatosServerSecadorasRot');
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
        <Icon name="robot-confused" size={30} color="#FFD700" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/Maquina2.png')}
        style={styles.image}
      />

      <View style={styles.containerCards}>
        <InfoCard title="Flexiones" value= {conteo_revSecadorasRot.toString()} />
        <InfoCard title="Estado" value={estado_pruebaSecadorasRot.toString()} />
        <InfoCard title="Velocidad de flexion (FPM)" value={velocidad_SecadorasRot.toString()} />
        <InfoCard title="Tiempo transcurrido (min)" value={tiempo_pruebaSecadorasRot.toString()} />
      </View>

            <Text style={styles.title}>CANTIDAD DE REVOLUCIONES</Text>
            <TextInput
              style={styles.input}
              value={revolucionesSecadoras}
              onChangeText={setRevoluciones}
              keyboardType="numeric"
              placeholder="Ingrese ciclos"
            />

            <Text style={styles.title}>REVOLUCIONES DE CAMBIO</Text>
            <TextInput
              style={styles.input}
              value={revCambioSecadoras}
              onChangeText={setCambio}
              keyboardType="numeric"
              placeholder="Ingrese el número de revoluciones para cambiar sentido"
            />

            <Text style={styles.title}>VELOCIDAD</Text>
            <TextInput
              style={styles.input}
              value={velocidadRevoluciones}
              onChangeText={setVelocidadRevoluciones}
              keyboardType="numeric"
              placeholder="Ingrese la velocidad en RPMs"
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

});

export default MaquinaSecadorasRotacionesScreen;
