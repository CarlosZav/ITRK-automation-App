import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert , TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
 
const FifthScreen = ({ navigation }) => {
 
  const [day, setDay] = useState('00');
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const [second, setSecond] = useState('00');
 
  const [day2, setDay2] = useState('00');
  const [hour2, setHour2] = useState('00');
  const [minute2, setMinute2] = useState('00');
  const [second2, setSecond2] = useState('00');

  const [ciclos, setCiclos] = useState('1');

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
 
  useEffect(() => {
    let timer;
    if (elapsedTime > 0) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
  
    return () => clearInterval(timer);
  }, [elapsedTime]);

  const esp8266IP = "http://192.168.95.205";  // Cambia esto con la IP de tu ESP8266
 
  // Función para enviar datos a la ESP8266
  const enviarDatos = async () => {
    try {
      const datos = {
        encendido: `${day}:${hour}:${minute}:${second}`,
        apagado: `${day2}:${hour2}:${minute2}:${second2}`,
        ciclos: ciclos,
      };
 
      const response = await fetch(`${esp8266IP}/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });
 
      const result = await response.text();
      Alert.alert('Respuesta de ESP8266', result);
      // Start the timer
      setElapsedTime(1); // Start counting from 1 second
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Alert.alert('Error', 'No se pudieron enviar los datos.');
    }
  };
 
  // Función para recibir datos de la ESP8266
  const recibirDatos = async () => {
    try {
      const response = await fetch(`${esp8266IP}/recibir`, {
        method: 'GET',
      });
 
      const result = await response.text();
      Alert.alert('Datos recibidos de ESP8266', result);
    } catch (error) {
      console.error("Error al recibir los datos:", error);
      Alert.alert('Error', 'No se pudieron recibir los datos.');
    }
  };

  // Function to reset values
  const resetValues = () => {
    setDay('00');
    setHour('00');
    setMinute('00');
    setSecond('00');

    setDay2('00');
    setHour2('00');
    setMinute2('00');
    setSecond2('00');

    setCiclos('1');
  };

  const pausarCiclo = () => {
    // Implement your logic to pause the cycle here
    Alert.alert('Ciclo pausado');
  };

  return (
    <View style={styles.container}>
      <View style={styles.image_container}>
        <Image
          source={require('../../assets/Maquina4.png')}
          style={styles.image}
        />
      </View>

      <Text style={styles.clock}>
        Tiempo transcurrido:  {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
      </Text>

      <Text style={styles.title}>TIEMPO DE ENCENDIDO</Text>
            <View style={styles.pickerRow}>
              {/* Día */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Día</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.selectedValue}>:{day}</Text>
                  <Picker
                    selectedValue={day}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDay(itemValue)}
                  >
                    {[...Array(32).keys()].map((day) => (
                      <Picker.Item key={day} label={(day).toString().padStart(2, '0')} value={day} />
                    ))}
                  </Picker>
                  
                </View>
              </View>

              {/* Hora */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{hour}</Text>
                  <Picker
                    selectedValue={hour}
                    style={styles.picker}
                    onValueChange={(itemValue) => setHour(itemValue)}
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Minuto */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Minuto</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{minute}</Text>
                  <Picker
                    selectedValue={minute}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMinute(itemValue)}
                  >
                    {[...Array(60).keys()].map((minute) => (
                      <Picker.Item key={minute} label={minute.toString().padStart(2, '0')} value={minute} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Segundo */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Segundo</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{second}</Text>
                  <Picker
                    selectedValue={second}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSecond(itemValue)}
                  >
                    {[...Array(60).keys()].map((second) => (
                      <Picker.Item key={second} label={second.toString().padStart(2, '0')} value={second} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
 
            <Text style={styles.title}>TIEMPO DE APAGADO</Text>
            <View style={styles.pickerRow}>
              {/* Día */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Día</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{day2}</Text>
                  <Picker
                    selectedValue={day2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDay2(itemValue)}
                  >
                    {[...Array(32).keys()].map((day) => (
                      <Picker.Item key={day} label={(day).toString().padStart(2, '0')} value={day} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Hora */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{hour2}</Text>
                  <Picker
                    selectedValue={hour2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setHour2(itemValue)}
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Minuto */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Minuto</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{minute2}</Text>
                  <Picker
                    selectedValue={minute2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMinute2(itemValue)}
                  >
                    {[...Array(60).keys()].map((minute) => (
                      <Picker.Item key={minute} label={minute.toString().padStart(2, '0')} value={minute} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
 
              {/* Segundo */}
              <View style={styles.pickerLabelContainer}>
                <Text style={styles.pickerLabel}>Segundo</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.selectedValue}>:{second2}</Text>
                  <Picker
                    selectedValue={second2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSecond2(itemValue)}
                  >
                    {[...Array(60).keys()].map((second) => (
                      <Picker.Item key={second} label={second.toString().padStart(2, '0')} value={second} />
                    ))}
                  </Picker>
                  
                </View>
              </View>
            </View>
      
            <Text style={styles.title}>CANTIDAD DE CICLOS</Text>
            <TextInput
              style={styles.input}
              value={ciclos}
              onChangeText={setCiclos}
              keyboardType="numeric"
              placeholder="Ingrese ciclos"
            />
      
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Enviar Datos" color="#FFD700" onPress={enviarDatos} />
        </View>
        <View style={styles.button}>
          <Button title="Recibir Datos" color="#FFD700" onPress={recibirDatos} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Resetear Valores" color="#FF6347" onPress={resetValues} />
        </View>
        <View style={styles.button}>
          <Button title="Pausar ciclo" color="#FF6347" onPress={resetValues} />
        </View>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  image_container: {
    flex: 1, // Take the full height and width
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#fff', // Optional background color
  },
  image: {// Take the full height and width
    width: 100, // Set your desired width
    height: 100, // Set your desired height
  },
  clock: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    alignItems: 'center',
  },
  pickerLabelContainer: {
    alignItems: 'center',
    width: 80,
  },
  pickerLabel: {
    fontSize: 14,
    marginBottom: 3,
  },
  picker: {
    height: 50,
    width: 35,
    borderWidth: 1,
    textAlign: 'flex-end',
    alignItems: 'flex-end',
    borderColor: '#FFD700', // Amarillo
    borderRadius: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30
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
    flexDirection: 'row',
    justifyContent: 'space-around', // Adjusts spacing between buttons
    marginTop: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5, // Adds space between buttons
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
 
export default FifthScreen;