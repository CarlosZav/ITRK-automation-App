import React, { useState, useRef,  useEffect} from 'react';
import { Alert, View, TouchableOpacity, Text, Button, StyleSheet, SafeAreaView, Image, Dimensions, Animated, Easing, TextInput} from 'react-native';
import { ScrollView } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LineChart } from "react-native-gifted-charts";
import { io } from "socket.io-client";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";

const SERVER_URL = 'http://192.168.0.101:5000';// 192.168.0.101

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.465; // Slightly less than half for spacing

const TemperaturaScreen = ({ navigation }) => {

  const [tiempoPrueba, setTiempoPrueba] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState('');
  
  const [showPicker, setShowPicker] = useState(false);
  const [alarmString, setAlarmString] = useState(null); // Eliminado <string | null>

  const [tiempo, setTiempo] = useState(0);
  const [nombreIngeniero, setNombreIngeniero] = useState("");
  const [estadoHorno, setEstadoHorno] = useState("Configurando...");
  const [estadoLocal, setEstadoLocal] = useState(false);

  const [tiempoMuestreoTemperatura, setTiempoMuestreoTemperatura] = useState(0);

  const [tempTermo1, setTempTermo1] = useState(0.0);
  const [tempTermo2, setTempTermo2] = useState(0.0);
  const [tiempoDato, setTiempoDato] = useState(0.0);

  const MAX_POINTS = 20;

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  function pushData(prevData, newValue, label) {
    const newPoint = { value: newValue, label };

    if (prevData.length >= MAX_POINTS) {
      return [...prevData.slice(1), newPoint]; // elimina el más viejo
    }

    return [...prevData, newPoint];
  }



  // Eliminados los tipos de los parámetros
  const formatTime = ({ hours, minutes, seconds }) => {
    const timeParts = [];

    if (hours !== undefined) {
        timeParts.push(hours.toString().padStart(2, "0"));
    }
    if (minutes !== undefined) {
        timeParts.push(minutes.toString().padStart(2, "0"));
    }
    if (seconds !== undefined) {
        timeParts.push(seconds.toString().padStart(2, "0"));
    }

    return timeParts.join(":");
  };

  const toggleMenu = () => {
      const config = {
      toValue: expanded ? 0 : 1,
      duration: 400,
      useNativeDriver: false, // Height doesn't support native driver
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      };

      Animated.timing(animationController, config).start();
      setExpanded(!expanded);
  };

    // Interpolate values for height and opacity
    const arrowAngle = animationController.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const bodyHeight = animationController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 400], // Adjust 150 to the height of your hidden content
    });

    const bodyOpacity = animationController.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const ChartCard = ({ title, dateRange, data, color, isLarge = false }) => (
        <View style={[styles.card, isLarge ? styles.largeCard : { width: CARD_WIDTH }]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.date}>{dateRange}</Text>
            
            <View style={styles.chartContainer}>
                <LineChart
                areaChart
                curved = {false}
                data={data}
                rotateLabel
                isAnimated
                animationDuration={2000} // Speed of the "filling" effect
                startFillColor={color}
                startOpacity={0.3}
                endOpacity={0.05}
                initialSpacing={10}
                color={color}
                thickness={3}
                hideRules
                yAxisColor="transparent"
                xAxisColor="transparent"
                yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: 'gray', fontSize: 10 }}
                hideDataPoints={false}
                dataPointsColor={color}
                dataPointsRadius={3}
                // Adjust width based on card size
                width={isLarge ? width - 100 : CARD_WIDTH - 60}
                height={isLarge ? 250 : 150}
                />
            </View>
        </View>
    );

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
      newSocket.on('dataTemperatureApp', (data) => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          console.log('Datos recibidos:', data);
          setTempTermo1(data.tempTermo1);
          setTempTermo2(data.tempTermo2);
          setTiempoDato(data.tiempoDato);

          const promedio = tempTermo1 + tempTermo2 / 2;
          const label = data.tiempoDato || '';

          setData1(prev => pushData(prev, tempTermo1, label));
          setData2(prev => pushData(prev, tempTermo2, label));
          setData3(prev => pushData(prev, promedio, label));
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
      setEstadoLocal(true);
      const datos = {
        nombreIngeniero: nombreIngeniero,
        tiempoPruebaHorno: tiempo,
        pausarHornosTemperatura : 'NO',
        tiempoMuestreoTemperatura: tiempoMuestreoTemperatura
      };
      socket.emit('datosFromTemperaturaHorno', datos);
    };
   
    const sendMessage_pausar = () => {
      const datos = {
        pausarHornosTemperatura: 'SI',
      };
      socket.emit('datosTemperaturaHornoPausar', datos);
    };
  
    const sendMessage_reanudar = () => {
      const datos = {
        pausarHornosTemperatura: 'NO',
      };
      socket.emit('datosTemperaturaHornoPausar', datos);
    };
    
  return (
    <ScrollView contentContainerStyle={styles.container}>

        <TouchableOpacity
            style={styles.helpIcon}
            onPress={() => navigation.navigate('Ayuda Maquina Flexiones')} // Navegar a la pantalla de ayuda
            >
            <MaterialCommunityIcons name="robot-confused" size={30} color="#FFD700" />
        </TouchableOpacity>

      <View style={styles.row}>
        <ChartCard title="Temperatura 1" dateRange="15 April - 21 April" data={data1} color="#007AFF" />
        <ChartCard title="Temperatura 2" dateRange="15 April - 21 April" data={data2} color="#FF3B30" />
      </View>

      {/* Bottom Row: Centered Large Chart */}
      <View style={styles.centeredRow}>
        <ChartCard title="Promedio de temperatura" dateRange="15 April - 21 April" data={data3} color="#5AC8FA" isLarge />
      </View>

      <View style = {styles.secondRow}>
        <View style = {styles.timeCard} title = "Tiempo restatnte">
          <Text style={styles.Cardtitle}>Tiempo Restante</Text>
          <CountdownCircleTimer
            isPlaying = {estadoLocal}
            duration={tiempo}
            colors={['#b77dee', '#e483ec', '#e623f8', '#fc00fc']}
            colorsTime={[7, 5, 1, 0]}
          > 
            {({ remainingTime }) => <Text style={styles.timeText}>{String(Math.floor(remainingTime/3600)).padStart(2,'0')}:{String(Math.floor(remainingTime/60) - (60 *Math.floor(remainingTime/3600))).padStart(2,'0')}:{String(remainingTime - Math.floor(remainingTime/60) * 60).padStart(2,'0') }</Text>}
          </CountdownCircleTimer>
        </View>
        <View style = {styles.ThirdRow}>
          <View style = {styles.dataCards} title = "Datos">
              <Text style={styles.Cardtitle}>Ingeniero en prueba</Text>
              <Text style={styles.cardInfo}>{nombreIngeniero}</Text>
          </View>
          <View style = {styles.dataCards} title = "Datos">
              <Text style={styles.Cardtitle}>Tiempo de prueba</Text>
              <Text style={styles.cardInfo}>{String(Math.floor(tiempo/3600)).padStart(2,'0')}:{String(Math.floor(tiempo/60) - (60 *Math.floor(tiempo/3600))).padStart(2,'0')}:{String(tiempo - Math.floor(tiempo/60) * 60).padStart(2,'0') }</Text>
          </View>
          <View style = {styles.dataCards} title = "Datos">
              <Text style={styles.Cardtitle}>Estado de prueba</Text>
              <Text style={styles.cardInfo}>{estadoHorno}</Text>
          </View>
        </View>
      </View>

      <View style={styles.containerButtonx}>
        {/* Main Trigger Button */}
        <TouchableOpacity style={styles.button} onPress={toggleMenu} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{expanded ? "Hide Options" : "Show Options"}</Text>
            <Animated.Text style={{ transform: [{ rotate: arrowAngle }], color: 'white' }}>
            ▼
            </Animated.Text>
        </TouchableOpacity>

        {/* Animated Content Container */}
        <Animated.View style={[styles.extraContent, { height: bodyHeight, opacity: bodyOpacity }]}>
        
            <View style={{alignItems: "center", justifyContent: "center" }}>
              <Text style={{ marginTop: 25, fontSize: 18, color: "#202020" }}>
                  {alarmString !== null ? "Tiempo establecido" : "Presiona el botón para establecer tiempo de calentamiento"}
              </Text>
              
              <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowPicker(true)}>
                  <View style={{ alignItems: "center" }}>
                      {alarmString !== null ? (
                          <Text style={{ color: "#202020", fontSize: 20 }}>
                              {alarmString}
                          </Text>
                      ) : null}
                      
                      <View style={{ alignContent: 'center',
                                justifyContent: 'center', alignContent: 'center',
                                marginTop: 30, marginLeft: 10 }}>
                          <Text
                              style={{
                                backgroundColor: "#FFD700",  
                                color: "#ffffff",
                                borderRadius: 5,
                                width: 180,
                                padding: 8,
                                fontWeight: 'bold',
                      
                              }}>
                              {"    Establecer tiempo"}
                          </Text>
                      </View>
                  </View>
              </TouchableOpacity>

              <TimerPickerModal
                  closeOnOverlayPress
                  LinearGradient={LinearGradient}
                  modalTitle="Tiempo de calentamiento"
                  onCancel={() => setShowPicker(false)}
                  onConfirm={(pickedDuration) => {
                      setAlarmString(formatTime(pickedDuration));
                      setShowPicker(false);
                      const totalSegundos = pickedDuration.hours * 3600 + pickedDuration.minutes * 60 +pickedDuration.seconds;

                      setTiempo(totalSegundos);
                  }}
                  setIsVisible={setShowPicker}
                  styles={{
                    theme: "light",

                    confirmButton: {
                      borderColor: "#FFD700",     // <--- Cambia aquí el color del contorno
                      borderWidth: 2,             // Grosor del borde
                      borderRadius: 10,           // Redondeado de las esquinas
                      paddingHorizontal: 20,      // Espaciado interno horizontal
                      color: "#FFD700", // Color del texto
                      fontWeight: "bold",
                      fontSize: 15,

                    },
                  }}
        
                  visible={showPicker}
              />
            </View>

            <View style={styles.TextEntry}>
                <Text style={styles.titleInput}>Nombre del ingeniero</Text>
                  <TextInput
                      style={styles.input}
                      value={nombreIngeniero}
                      onChangeText={(text) => {
                      setNombreIngeniero(text);
                      }}
                      keyboardType="default"
                      placeholder="Ingrese el nombre del ingeniero que realiza la prueba"
                  />

                <Text style={styles.titleInput}>Tiempo de muestreo</Text>
                  <TextInput
                      style={styles.input}
                      value={tiempoMuestreoTemperatura}
                      onChangeText={(text) => {
                        if (text === '0') {
                          alert('El valor no puede ser 0');
                          return;
                        }
                        setTiempoMuestreoTemperatura(text);
                      }}
                      keyboardType="numeric"
                      placeholder="Ingrese el periodo de tiempo para recibir datos en segundos"
                  />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={sendMessage} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Iniciar</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendMessage_pausar} style={styles.subButton}><Text style = {[{color: 'white', fontWeight: "bold",}]}>Pausar</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendMessage_reanudar} style={[styles.subButton, {backgroundColor: '#FF3B30'}]}><Text style={{color: 'white'}}>Parar</Text></TouchableOpacity>
            </View>
        
        </Animated.View>
        </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    paddingBottom: 10, // opcional, para dejar espacio al final
    },

  helpIcon:{
    position: 'absolute',
    top: 10, // Ajusta según tu diseño
    right: 20, // Ajusta según tu diseño
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 60,
    flex: 1,
  },

  centeredRow: {
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
  },

  largeCard: {
    width: '100%',
  },
  
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1C1C1E',
  },

  date: {
    fontSize: 12,
    textAlign: 'center',
    color: '#8E8E93',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginLeft: -20, // Offsets the internal library padding
  },

  containerButtonx: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden', // Crucial for hiding the retracting content
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: -1,
    marginBottom: 20
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
    paddingHorizontal: 15,
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
    textAlign: 'center',
    fontSize: 12,
  },

  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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

  buttonZoom:{
    paddingHorizontal: 20,
  },

  secondRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 15,
    flexWrap: 'wrap',
    flex: 1,
    alignItems: "center", // ignore this - we'll come back to it
    justifyContent: "center", // ignore this - we'll come back to it
    margin: 20,
  },

  ThirdRow:{
    alignItems: "center", // ignore this - we'll come back to it
    justifyContent: "center", // ignore this - we'll come back to it
    flexDirection: "column",
  },

  timeCard: {
    flex: 1,
    backgroundColor: 'white', // Set the background to white
    borderRadius: 20,        // Optional: Add rounded corners for a softer look            
    marginVertical: 0,       // Optional: Add vertical margin to separate cards
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
    marginRight: 10,
    height: 250
  },

  dataCards:{
    flex: 1,
    backgroundColor: 'white', // Set the background to white
    borderRadius: 10,        // Optional: Add rounded corners for a softer look            
    marginVertical: 3,       // Optional: Add vertical margin to separate cards
    marginHorizontal: 0,     // Optional: Add horizontal margin
    borderColor: '#ccc',       // Set a light gray border color for contrast
    borderWidth: 1,          // Set the border width
    justifyContent: 'center', // Center the content vertically within the card (if needed)
    // Optional: Add shadow for a lifted effect (platform-specific)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: width * 0.55,
  },

  CardtitleTime: {
    marginTop: -18,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1C1C1E',
    marginBottom: 10
  },

  Cardtitle: {
    marginTop: -5,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#1C1C1E',
    marginBottom: 10,
    marginLeft: 20
  },

  cardInfo: {
    marginTop: -10,
    fontSize: 17,
    textAlign: 'left',
    color: '#1C1C1E',
    marginBottom: 5,
    marginLeft: 20
  },
  
  timeText: {
    fontSize: 20,
    color: '#1C1C1E',

  },

});

export default TemperaturaScreen;
