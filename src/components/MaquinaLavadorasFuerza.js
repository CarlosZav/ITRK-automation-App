import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { io } from "socket.io-client";
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar los iconos
import { ScrollView } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-gifted-charts';

const SERVER_URL = 'http://192.168.0.101:5000';

const InfoCard = ({ title, value }) => (
  <View style={styles.cardWrapper}>
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

let persistedForceData = [];

const MaquinaLavadorasFuerzaScreen = ({ navigation }) => {

  
  const [ciclosLavadorasFuerza, setCiclosLavadorasFuerza] = useState('');
  const [fuerzaInicial, setFuerzaInicial] = useState('');
  const [fuerzaFinal, setFuerzaFinal] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  //Comunicación WS Envío
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');

  //CARDS
  const [conteoCiclosLavadorasFuerza, setConteoCiclosLavadorasFuerza] = useState(0);
  const [fuerzaLavadoras, setFuerzaLavadoras] = useState(0);
  const [estadoLavadorasFuerza, setEstadoLavadorasFuerza] = useState("Stop");
  const [tiempoLavadorasFuerza, setTiempoLavadorasFuerza] = useState(0);

  const [setCiclosLavadorasFuerzaAnimacion, setSetCiclosLavadorasFuerza] = useState('0');
  const [conexionEspSecadorasRotacion, setConexionEspSecadorasRotacion] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false); // Initially disabled

  const [setVelocidadLavadorasFuerzaA, setSetVelocidadLavadorasFuerza] = useState('0')

  // 2. State initialized from persistence
  const [lineData, setLineData] = useState(persistedForceData);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = (screenWidth * 0.92) - 30; // Resta los paddings y márgenes del contenedor

  // Calculate dynamic Y-axis max based on data
  const maxY = useMemo(() => {
    const values = lineData.map(p => p.value);
    const highest = Math.max(...values, 10);
    return Math.ceil(highest / 100) * 100 + 100;
  }, [lineData]);



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
    newSocket.on('datosServidorLavadorasFuerza', (data) => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        console.log('Datos recibidos:', data);

        const force = data.fuerzaEjercida !== undefined ? data.fuerzaEjercida : 0; 
        const time = parseFloat((data.tiempoLavadorasFuerza / 60).toFixed(4)) || 0;

        setConteoCiclosLavadorasFuerza(data.conteoCiclosLavadorasFuerza);
        setEstadoLavadorasFuerza(data.estadoLavadorasFuerza);
        setSetCiclosLavadorasFuerza(data.ciclosLavadorasFuerza);
        //setSetFuerzaFinalAnimacion(data.fuerzaFinal);
        setFuerzaLavadoras(data.fuerzaEjercida)
        setTiempoLavadorasFuerza(parseFloat((data.tiempoLavadorasFuerza / 60).toFixed(4)));

        const newNode = {
        value: force,
        label: `${time.toFixed(2)}`, // Etiqueta del eje X
        labelTextStyle: { color: '#888', fontSize: 10 },
        };

        setLineData((prev) => {
        const updatedData = [...prev, newNode].slice(-30); // Conservar últimos 30 puntos
        persistedForceData = updatedData;
        return updatedData;
        });

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
      ciclosLavadorasFuerza: ciclosLavadorasFuerza,
      pausarLavadorasFuerza: 'NO',
      fuerzaFinal: fuerzaFinal,
      fuerzaInicial: fuerzaInicial
    
    };
    socket.emit('datosFromLavadorasFuerza', datos);
  };

  const sendMessage_pausar = () => {
    const datos = {
      pausarLavadorasFuerza: 'SI',
    };
    socket.emit('datosFromLavadorasPausarFuerza', datos);
  };

  const sendMessage_reanudar = () => {
    const datos = {
      pausarLavadorasFuerza: 'NO',
    };
    socket.emit('datosFromLavadorasPausarFuerza', datos);
  };

  
  // Función para resetear valores
  const resetValues = () => {
    
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

  const fillValueForProgress = setCiclosLavadorasFuerzaAnimacion !== '0' && !isNaN(parseFloat(setCiclosLavadorasFuerzaAnimacion))
    ? (conteoCiclosLavadorasFuerza * 100) / parseFloat(setCiclosLavadorasFuerzaAnimacion)
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
        <InfoCard title="Ciclos" value= {conteoCiclosLavadorasFuerza.toString()} />
        <InfoCard title="Estado" value={estadoLavadorasFuerza.toString()} />
        <InfoCard title="Tiempo transcurrido (min)" value={tiempoLavadorasFuerza.toString()} />
        <InfoCard title="Fuerza ejercida (N)" value={fuerzaLavadoras.toString()} />
      </View>

      <View style={styles.containerGraph}>

      <View style={styles.cardContainerCircular} title="Ciclos">
      
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
              {Math.round((fill * parseFloat(setCiclosLavadorasFuerzaAnimacion)) / 100)} / {Math.round(parseFloat(setCiclosLavadorasFuerzaAnimacion))}
            </Text>
          )}
        </AnimatedCircularProgress>

      </View>

      <View style={styles.cardChart}>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.title}>Fuerza de Lavado</Text>
            <Text style={styles.label}>Tiempo: {tiempoLavadorasFuerza} min</Text>
          </View>
          <Text style={styles.currentValue}>{fuerzaLavadoras} N</Text>
        </View>

        <LineChart
          data={lineData}
          height={250}
          width={chartWidth - 80}
          thickness={3}
          color="#FFD700" // Golden yellow line
          hideDataPoints={false}
          dataPointsColor="#F43F5E"
          
          // Axis setup
          xAxisThickness={1}
          yAxisThickness={1}
          xAxisColor="#FFD700"
          yAxisColor="#FFD700"

          
          // Y-axis config
          noOfSections={10}
          maxValue={maxY}
          yAxisTextStyle={styles.axisText}
          yAxisTextStyle={{ fontSize: 12, color: '#888' }}
          
          // X-axis (Time)
          xAxisLabelTextStyle={styles.axisText}
          rotateLabel // Rotates time labels if they get crowded
          
          // Performance
          animateOnDataChange={false} 
          initialSpacing={10}
          spacing={35}
        />
      </View>

      </View>

            <Text style={styles.title}>CANTIDAD DE CICLOS</Text>
            <TextInput
              style={styles.input}
              value={ciclosLavadorasFuerza}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setCiclosLavadorasFuerza(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese el numero de ciclos totales totales"
            />

            <Text style={styles.title}>FUERZA INICIAL</Text>
            <TextInput
              style={styles.input}
              value={fuerzaInicial}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setFuerzaInicial(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese la fuerza inicial en N"
            />

            <Text style={styles.title}>FUERZA FINAL</Text>
            <TextInput
              style={styles.input}
              value={fuerzaFinal}
              onChangeText={(text) => {
                if (text === '0') {
                  alert('El valor no puede ser 0');
                  return;
                }
                setFuerzaFinal(text);
              }}
              keyboardType="numeric"
              placeholder="Ingrese la fuerza final en N"
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

  containerGraph: {
    flexDirection: 'row',   // Alinea los hijos en fila
    flexWrap: 'wrap',       // Si no caben, bajan automáticamente
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,                // Espacio entre ellos
    width: '100%',
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

  container: {
  padding: 20,
  backgroundColor: '#fff',   // White background
  alignItems: 'center',
  },

  cardChart: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    borderWidth: 1,
    borderColor: '#FFD700',
    width: '92%',        // Ocupará el 92% del ancho de la pantalla
    alignSelf: 'center',

  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

});

export default MaquinaLavadorasFuerzaScreen;
